# Caça-Comp
Jogo de Caça-Palavras com componentes computacionais (HTML, CSS e JavaScript puros).

## Como jogar
1. No menu, clique em **Jogar** e depois em **Começar** (o cronômetro inicia e o tabuleiro é revelado).
2. Leia as dicas e clique nas letras em sequência, sempre na mesma direção e sentido (horizontal, vertical ou diagonal, em qualquer sentido).
3. Se a sequência formar uma das 16 palavras, ela é marcada e sua dica fica esmaecida.
4. **Pausar** cobre o tabuleiro e as dicas. **Desistir** registra a partida. Passou de 59:59, a partida é encerrada automaticamente.

## Editar as dicas
Abra `dicas.js` e altere apenas os textos. Não mude a ordem nem a quantidade (16): o comentário ao lado de cada item indica a palavra.

## Arquivos
`index.html` (menu) · `jogo.html` · `style.css` · `script.js` · `dicas.js`

Funciona abrindo `index.html` direto no navegador. O histórico fica no `localStorage` do navegador.
