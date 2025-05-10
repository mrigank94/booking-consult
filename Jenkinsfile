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

        stage('Build and Start Services') {
            steps {
                script {
                    sh 'docker-compose build'
                    sh 'docker-compose up -d'
                }
            }
        }

        stage('Run Tests') {
            steps {
                // Add your test commands here if needed
                echo 'Running tests...'
                // e.g., sh 'docker-compose exec backend npm test'
            }
        }

        stage('Teardown') {
            steps {
                script {
                    sh 'docker-compose down -v'
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            sh 'docker-compose down -v || true'
        }
    }
}