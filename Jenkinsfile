pipeline {
    agent any

    tools {
        jdk 'jdk17' 
        nodejs 'nodejs18'
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                echo 'Checking out code from Git...'
                // FIXED: Explicitly added "branch: 'main'" to check out the correct branch.
                git url: 'https://github.com/DarshJodhani/web-performance-demo.git', branch: 'main'
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
                sh 'nohup node index.js & echo $! > .pid'
                sleep 5 
            }
        }

        stage('4. Run JMeter Load Test') {
            steps {
                echo 'Running JMeter performance test...'
                // NOTE: Remember to update this path to your actual JMeter installation.
                sh 'JVM_ARGS="--add-opens=java.desktop/sun.awt.X11=ALL-UNNAMED" /path/to/your/apache-jmeter-5.6.3/bin/jmeter.sh -n -t HomePageTest.jmx -l results.jtl'
            }
        }
        
        stage('5. Run Lighthouse Audit') {
            steps {
                echo 'Running Lighthouse audit...'
                sh 'npm install -g lighthouse'
                sh 'lighthouse http://localhost:3000 --output="html" --output-path="./lighthouse-report.html" --chrome-flags="--headless --no-sandbox"'
            }
        }
    }

    post {
        always {
            // FIXED: Removed the extra "steps { ... }" wrapper.
            echo 'Stopping the web application and publishing reports...'
            
            // This script block handles the case where the .pid file might not exist if an earlier stage failed.
            script {
                if (fileExists('.pid')) {
                    sh 'kill $(cat .pid)'
                } else {
                    echo 'PID file not found, skipping kill command.'
                }
            }

            perfReport sourceDataFiles: 'results.jtl', 
                        errorFailedThreshold: 10,
                        errorUnstableThreshold: 5,
                        compareBuildPrevious: true

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
