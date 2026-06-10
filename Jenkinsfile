pipeline {
    agent any

    enviroment {
        IMAGE_NAME = 'integracion-api-jenkins'
        IMAGE_TAG = '2.0'
        APP_URL = 'http://localhost:3000/healt'
    }

    stages {
        stage('Checkout'){
            steps {
                echo 'Clonado repositorio desde GitHub...'
                checkout scm
            }
        }

        stage('Verificar Docker'){
            steps {
                echo 'Validando Disponibilidad de Docker...'
                bat 'docker --version'
                bat 'docker compose version'
            }
        }

        stage('Construir imagen Docker'){
            steps {
                echo 'Construyendo imagen Docker de la API...'
                bat 'docker build -t %IMAGE_NAME%:%IMAGE_TAG% .'
            }
        }

        stage('Limpiar contenedores anteriores'){
            steps {
                echo 'Deteniendo contenedores anterios si existen...'
                bat 'docker compose down -v || exit 0'
            }
        }

        stage('Desplegar aplicacion con Docker Compose'){
            steps {
                echo 'Levantando API Y DB con docker compose...'
                bat 'docker compose up -d'
            }
        }

        stage('Validar Contenedores'){
            steps {
                echo 'Listando Contenedores activos...'
                bat 'docker ps'
            }
        }

        stage('Esperar servicios'){
            steps {
                echo 'Esperando inicializacion de servicios...'
                bat 'powershell -Command "Star-Sleep -Seconds 20"'
            }
        }

        stage('Probar API'){
            steps {
                echo 'Validando endpoint /health de API...'
                bat 'powershell -Command "Invoke-WebRequest -Uri %APP_URL%" -UseBasicParsing'
            }

    }
}

post {
    succes {
        echo 'Pipeline ejecutado correctamente.'
    }

    failure {
        echo 'Pipeline ejecutado incorrectamente. Revisar Logs de ejecucion'
    }

    always {
        echo 'Estado final de contendores:'
        bat 'docker ps -a'
    }

    
}