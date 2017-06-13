#!/usr/bin/env bash

function y {
  eval "qdbus org.kde.yakuake $@"
}

function cmd {
  y "/yakuake/sessions runCommandInTerminal $1 \"$2\""
}

x_server=$(y "/yakuake/sessions org.kde.yakuake.addSession")
x_server_term=$(y "/yakuake/sessions terminalIdsForSessionId $x_server")
x_compile=$(y "/yakuake/sessions org.kde.yakuake.addSession")
x_compile_term=$(y "/yakuake/sessions terminalIdsForSessionId $x_compile")
x_common=$(y "/yakuake/sessions org.kde.yakuake.splitSessionLeftRight $x_compile")
x_lib=$(y "/yakuake/sessions org.kde.yakuake.splitTerminalTopBottom $x_common")
x_adapters=$(y "/yakuake/sessions org.kde.yakuake.splitTerminalTopBottom $x_common")
x_react=$(y "/yakuake/sessions org.kde.yakuake.splitTerminalTopBottom $x_lib")

# tab names
y "/yakuake/tabs setTabTitle $x_server explorejs-server"
y "/yakuake/tabs setTabTitle $x_compile explorejs-tester"
y "/yakuake/tabs setTabTitle $x_lib explorejs-lib"

# execute
dir=`pwd`


cmd $x_server_term "cd $dir/packages/explorejs-server && ./main.js -r 8080 -d"
cmd $x_compile_term "cd $dir/packages/explorejs-tester && npm start"
cmd $x_common "cd $dir/packages/explorejs-common && npm run build:dev -- --watch"
cmd $x_lib "cd $dir/packages/explorejs-lib && npm run build:dev -- --watch"
cmd $x_adapters "cd $dir/packages/explorejs-adapters && npm run build:dev -- --watch"
cmd $x_react "cd $dir/packages/explorejs-react && npm run build:dev -- --watch"