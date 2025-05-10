pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and start services') {
            steps {
                script {
                    sh '''
                        export PATH=$PATH:/opt/homebrew/bin
                        docker-compose build
                        docker-compose up -d
                    '''
                }
            }
        }

        stage('Run tests') {
            steps {
                echo 'Running tests'
            }
        }
    }
}