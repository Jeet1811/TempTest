pipeline {
    agent any

    tools {
    jdk 'jdk17'
    nodejs 'nodejs18' // Add this line
    }

    stages {
        stage('1. Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh 'npm install'
            }
        }

        stage('2. Start Application') {
            steps {
                echo 'Starting the web application in the background...'
                // Start the app and save its process ID (PID)
                sh 'nohup node index.js & echo $! > .pid'
                // Give the server a moment to start up
                sleep 5
            }
        }

        stage('3. Run JMeter Load Test') {
            steps {
                echo 'Running JMeter performance test...'
                // IMPORTANT: The path below assumes JMeter is installed inside your
                // Jenkins agent's environment at '/opt/jmeter/'. A local Windows
                // path like 'G:\...' will NOT work.
                sh '/opt/jmeter/bin/jmeter -n -t HomePageTest.jmx -l results.jtl'
            }
        }

        stage('4. Run Lighthouse Audit') {
            steps {
                echo 'Running Lighthouse audit...'
                // Install Lighthouse CLI globally inside the agent and run the audit
                sh 'npm install -g lighthouse'
                sh 'lighthouse http://localhost:3000 --output="html" --output-path="./lighthouse-report.html" --chrome-flags="--headless --no-sandbox"'
            }
        }
    }

    post {
        always {
            // The 'steps' wrapper is removed from here as it's invalid syntax.
            echo 'Stopping the web application and publishing reports...'

            // Stop the application using its saved process ID
            sh 'kill $(cat .pid)'

            // Publish JMeter Report using the Performance Plugin
            perfReport sourceDataFiles: 'results.jtl',
                        errorFailedThreshold: 10,
                        errorUnstableThreshold: 5,
                        compareBuildPrevious: true

            // Publish Lighthouse Report using the HTML Publisher Plugin
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

