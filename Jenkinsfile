pipeline {
    agent any

    tools {
        nodejs 'Node 18'
    }

    environment {
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'server'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Clone') {
            steps {
                git 'https://github.com/mrigank94/booking-consult.git'
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Frontend') {
                    steps {
                        dir("${env.FRONTEND_DIR}") {
                            sh 'npm install'
                        }
                    }
                }
                stage('Backend') {
                    steps {
                        dir("${env.FRONTEND_DIR}") {
                            sh 'npm install'
                        }
                    }
                }

            }
        }

        stage('Build Frontend') {
            steps {
                dir("${env.FRONTEND_DIR}") {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploy step'
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully!'
        }
        failure {
            echo 'CI/CD failed. Check logs'
        }
    }
}