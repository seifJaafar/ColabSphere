@echo off
cd /d "%~dp0kafka"

echo Starting Zookeeper...
start bin\windows\zookeeper-server-start.bat config\zookeeper.properties

timeout /t 5 /nobreak >nul

echo Starting Kafka...
start bin\windows\kafka-server-start.bat config\server.properties

echo Kafka started successfully!
