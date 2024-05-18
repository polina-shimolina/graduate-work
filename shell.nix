{ pkgs ? import <nixpkgs> {} }:

(pkgs.buildFHSUserEnv {
  name = "pipzone";
  targetPkgs = pkgs: (with pkgs; [
    python3
    python3Packages.pip
    python3Packages.virtualenv
    nodejs
  ]);
  runScript = ''
    # Создаем и активируем виртуальную среду
    virtualenv venv
    source venv/bin/activate

    # Устанавливаем пакеты через pip
    pip install asgiref django djangorestframework djangorestframework-simplejwt numpy matplotlib drf-yasg inflection packaging pandas pillow pyjwt pytz pyyaml setuptools scikit-learn sqlparse tzdata torch torchvision uritemplate torchviz opencv-python

    # Меняем приглашение командной строки
    export PS1="\\[\033[34m\][nix-shell:\\w] \\[\033[0m\]$ "
    
    # Запускаем bash для работы в новой среде
    exec bash
  '';
}).env
