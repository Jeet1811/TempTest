pipeline {
    agent any

    tools {
        // Assumes you have a JDK named 'jdk17' configured in Jenkins
        // Go to Manage Jenkins -> Tools -> JDK Installations -> Add JDK
        jdk 'jdk17' 
        nodejs 'nodejs18'
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                echo 'Checking out code from Git...'
                // NOTE: Change this URL to your actual repository
                git 'https://github.com/DarshJodhani/web-performance-demo.git'
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
                // CHANGED: Added JVM_ARGS to fix the Java module error on Kali.
                // CHANGED: Updated the path to a Linux format. You MUST change this to your actual JMeter path.
                sh 'JVM_ARGS="--add-opens=java.desktop/sun.awt.X11=ALL-UNNAMED" /path/to/your/apache-jmeter-5.6.3/bin/jmeter.sh -n -t HomePageTest.jmx -l results.jtl'
            }
        }
        
        stage('5. Run Lighthouse Audit') {
            steps {
                echo 'Running Lighthouse audit...'
                // The --no-sandbox flag is required to run as the root user in a CI environment.
                sh 'npm install -g lighthouse'
                sh 'lighthouse http://localhost:3000 --output="html" --output-path="./lighthouse-report.html" --chrome-flags="--headless --no-sandbox"'
            }
        }
    }

    post {
        always {
            steps {
                echo 'Stopping the web application and publishing reports...'
                
                // Stop the application
                sh 'kill $(cat .pid)'

                // Publish JMeter Report (Requires Performance Plugin)
                perfReport sourceDataFiles: 'results.jtl', 
                            errorFailedThreshold: 10,
                            errorUnstableThreshold: 5,
                            compareBuildPrevious: true

                // Publish Lighthouse Report (Requires HTML Publisher Plugin)
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

