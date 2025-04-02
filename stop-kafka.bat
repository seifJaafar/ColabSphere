@echo off
cd /d "%~dp0kafka"

echo Stopping Kafka...
start bin\windows\kafka-server-stop.bat

timeout /t 10 /nobreak >nul

echo Stopping Zookeeper...
start bin\windows\zookeeper-server-stop.bat

echo Kafka and Zookeeper stopped successfully!
