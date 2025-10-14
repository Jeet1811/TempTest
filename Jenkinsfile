pipeline {
    agent any

    tools {
        jdk 'jdk17'
        nodejs 'nodejs18' // Make sure 'nodejs18' is the name in Manage Jenkins -> Tools
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
                sh 'nohup node index.js & echo $! > .pid'
                sleep 5
            }
        }

        stage('3. Run JMeter Load Test') {
            steps {
                echo 'Running JMeter performance test...'
                // NOTE: This path MUST exist inside your Jenkins agent environment.
                sh '/opt/jmeter/bin/jmeter -n -t HomePageTest.jmx -l results.jtl'
            }
        }

        stage('4. Run Lighthouse Audit') {
            steps {
                echo 'Running Lighthouse audit...'
                sh 'npm install -g lighthouse'
                sh 'lighthouse http://localhost:3000 --output="html" --output-path="./lighthouse-report.html" --chrome-flags="--headless --no-sandbox"'
            }
        }
    }

    post {
        always {
            // ✅ CORRECTION: Wrap post-build actions in a 'script' block
            // This ensures they run on the agent with the correct workspace context.
            script {
                echo 'Stopping the web application and publishing reports...'

                // Stop the application. Added a check to prevent errors if .pid doesn't exist.
                sh 'if [ -f .pid ]; then kill $(cat .pid); fi'

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
