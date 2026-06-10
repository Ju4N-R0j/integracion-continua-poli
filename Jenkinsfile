pipeline {
    agent any

    environment {
        IMAGE_NAME = 'integracion-api-jenkins'
        IMAGE_TAG = '2.0'
        APP_URL = 'http://localhost:3000/health'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Clonando repositorio desde GitHub...'
                checkout scm
            }
        }

        stage('Verificar Docker') {
            steps {
                echo 'Validando disponibilidad de Docker en Jenkins...'
                bat 'docker --version'
                bat 'docker compose version'
            }
        }

        stage('Construir imagen Docker') {
            steps {
                echo 'Construyendo imagen Docker de la API...'
                bat 'docker build -t %IMAGE_NAME%:%IMAGE_TAG% .'
            }
        }

        stage('Limpiar contenedores anteriores') {
            steps {
                echo 'Deteniendo contenedores anteriores si existen...'
                bat 'docker compose down -v || exit 0'
            }
        }

        stage('Desplegar aplicacion con Docker Compose') {
            steps {
                echo 'Levantando API y base de datos con Docker Compose...'
                bat 'docker compose up -d'
            }
        }

        stage('Validar contenedores') {
            steps {
                echo 'Listando contenedores activos...'
                bat 'docker ps'
            }
        }

        stage('Esperar servicios') {
            steps {
                echo 'Esperando inicializacion de servicios...'
                bat 'powershell -Command "Start-Sleep -Seconds 20"'
            }
        }

        stage('Probar API') {
            steps {
                echo 'Validando endpoint /health de la API...'
                bat 'powershell -Command "Invoke-WebRequest -Uri %APP_URL% -UseBasicParsing"'
            }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutado correctamente. Jenkins construyo y desplego la aplicacion.'
        }

        failure {
            echo 'El pipeline fallo. Revisar logs de Jenkins para identificar el problema.'
            bat 'docker compose logs || exit 0'
        }

        always {
            echo 'Estado final de contenedores:'
            bat 'docker ps -a'
        }
    }
}