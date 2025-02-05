{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/3ffbbdbac0566a0977da3d2657b89cbcfe9a173b.tar.gz") {} }:
pkgs.mkShell {
  nativeBuildInputs = with pkgs; [
    svelte-language-server
    nodejs
  ];
}
