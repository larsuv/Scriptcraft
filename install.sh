#!bin/bash
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]:-$0}"; )" &> /dev/null && pwd 2> /dev/null; )";

cd $SCRIPT_DIR
#run installScriptcraft.sh and after that installVSCode.sh
bash installScriptcraft.sh
bash installVSCode.sh