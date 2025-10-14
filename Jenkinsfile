pipeline {
    agent any

    tools {
        // Assumes you have a JDK named 'jdk17' configured in Jenkins Global Tool Configuration
        // Go to Manage Jenkins -> Tools -> JDK Installations -> Add JDK
        jdk 'jdk17' 
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                echo 'Checking out code from Git...'
                git 'https://github.com/DarshJodhani/web-performance-demo.git' // <-- CHANGE THIS
            }
        }

        stage('2. Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh 'npm install'
            }
        }

        stage('3. Start Application') {
            steps {
                echo 'Starting the web application in the background...'
                // Start the app in the background and save its process ID (PID)
                sh 'nohup node index.js & echo $! > .pid'
                // Give the server a moment to start up
                sleep 5 
            }
        }

        stage('4. Run JMeter Load Test') {
            steps {
                echo 'Running JMeter performance test...'
                // NOTE: Update the path to your JMeter installation
                sh 'G:\\WPO\\web-perf-project\\apache-jmeter-5.6.3\\bin\\jmeter.sh -n -t HomePageTest.jmx -l results.jtl'
            }
        }
        
        stage('5. Run Lighthouse Audit') {
            steps {
                echo 'Running Lighthouse audit...'
                // Install Lighthouse CLI and run the audit
                // The --chrome-flags are needed to run Chrome headlessly in a CI environment
                sh 'npm install -g lighthouse'
                sh 'lighthouse http://localhost:3000 --output="html" --output-path="./lighthouse-report.html" --chrome-flags="--headless --no-sandbox"'
            }
        }
    }

    post {
    always {
        // The 'stage' wrapper has been removed.
        steps {
            echo 'Stopping the web application and publishing reports...'
            
            // Stop the application
            sh 'kill $(cat .pid)'

            // Publish JMeter Report
            perfReport sourceDataFiles: 'results.jtl', 
                       errorFailedThreshold: 10,
                       errorUnstableThreshold: 5,
                       compareBuildPrevious: true

            // Publish Lighthouse Report
            publishHTML(target: [
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: '.',
                reportFiles: 'lighthouse-report.html',
                reportName: 'Lighthouse HTML Report'
            ])
        }
    }
}
}
