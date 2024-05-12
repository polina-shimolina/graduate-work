{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    (pkgs.python3.withPackages (ps: with ps; [
      asgiref
      django
      djangorestframework
      djangorestframework-simplejwt
      drf-yasg
      inflection
      packaging
      pillow
      pyjwt
      pytz
      pyyaml
      setuptools
      sqlparse
      tzdata
      uritemplate
    ]))
    pkgs.nodejs
  ];

  shellHook = ''
    export PS1="\\[\033[34m\][nix-shell:\\w] \\[\033[0m\]$ "
  '';
}

