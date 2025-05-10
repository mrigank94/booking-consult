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
                    sh 'docker-compose build'
                    sh 'docker-compose up -d'
                }
            }
        }

        stage('Run tests') {
            steps {
                echo 'Running tests'
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
}