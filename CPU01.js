CPU = {};
CPU.think = function(col){
    // 置ける場所のリストアップ
    var setlist = [];
    var id = 0;
    for(var y=0; y < board.length; y++){
        for(var x=0; x < board[y].length; x++){
            // 検証用メモリ
            var b = cloneBoard();
            var res = GameBoard.flipSearch(
                b,
                col, x, y, true
            );
            if (res){
                setlist.push({id: id, x: x, y: y, board: b});
                id += 1;
                /*
                GameBoard.exec(board, col, x, y);
                return;
                */
            }
        }
    }

    var lstr = "";
    setlist.forEach(function(obj){
        log(obj.id);
        lstr += ('{x: '+obj.x + ', y: '+obj.y+'}');
        log(obj.board);
        // 盤面評価
        obj.score = CPU.fine(obj.board, col)
        log(obj.score);
    })
    log(lstr);

    // 結果をソート
    setlist.sort(function(a, b){
        if (a.score < b.score ) return -1;
        else if (b.score < a.score ) return 1;
        else return 0;
    });

    // 最小値を採用
    GameBoard.exec(board, col, setlist[0].x, setlist[0].y);
    log('use '+setlist[0].id );

};

// 盤面評価
CPU.fine = function(b, col){
    var cnt = 0;
    // 相手が置ける場所が少ないかどうかチェック
    for(var y=0; y < b.length; y++){
        for(var x=0; x < b[y].length; x++){
            // 検証用メモリ
            var res = GameBoard.flipSearch(
                b,
                -(col), x, y, false
            );
            if (res){
                cnt += 1;
            }
        }
    }
    return cnt;
}