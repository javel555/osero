$(function(){
    board = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,2,1,0,0,0],
    [0,0,0,1,2,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
    ];
    player = 1;

    var GameBoard = {};
    /*
      コマを置ける座標かどうか判定
      置ける座標ならtrue
      fがtrueなら盤面更新もやる
    */
    GameBoard.flipSearch = function(b, col, x, y, f = false){
        if (b[y][x] != 0){
            // そもそも置けない
            return false;
        }
        var flipList = [];
        var lineSearch = function(b, col, sx, sy, x, y){
            var px = sx + x;
            var py = sy + y;

            if( px < 0 || px > 7 || py < 0 || py > 7){
                // ボード外に出たので探索終了
                flipList = []; // キャッシュクリア
                return false;
            }
            else if( b[py][px] === 0 ){
                flipList = []; // キャッシュクリア
                return false; // コマが無いので探索終了
            }
            else if( b[py][px] === col){
                if (flipList.length == 0){
                    // 自コマだけど間になんもない
                    return false;
                }
                if (f){
                    flipList.forEach(function(pos){ // 自コマなので、キャッシュしてた座標を染める
                        b[pos[0]][pos[1]] = col;
                    });
                }
                flipList = []; // キャッシュクリア
                return true; //自コマなので探索終了
            }
            else if( b[py][px] !== col){
                flipList.push([py, px]); // 相手コマなのでキャッシュ
                return lineSearch(b, col, px, py, x, y); // 再帰探索
            }
        };

        // 8方向
        var res = false;
        //上
        res = (lineSearch(b, col, x, y, 0, -1) || res);
        //右上
        res = (lineSearch(b, col, x, y, 1, -1) || res);
        //右
        res = (lineSearch(b, col, x, y, 1, 0) || res);
        //右下
        res = (lineSearch(b, col, x, y, 1, 1) || res);
        //下
        res = (lineSearch(b, col, x, y, 0, 1) || res);
        //左下
        res = (lineSearch(b, col, x, y, -1, 1) || res);
        //左
        res = (lineSearch(b, col, x, y, -1, 0) || res);
        //左上
        res = (lineSearch(b, col, x, y, -1, -1) || res);

        return res;
    };
    GameBoard.exec = function( board, col, x, y ){
        x = parseInt(x,10);
        y = parseInt(y,10);

        // ボードをコピー
        var result = board.slice();

        // 盤面更新
        var f = GameBoard.flipSearch(board, col, x, y, true);

        if (f){
            // 置いた場所を更新
            result[y][x] = col;
        }

        // 盤面の結果を復帰
        return {
            board: result,
            put: f
        };
    }

    Controller = {};
    Controller.put = function(col, x, y){
        res = GameBoard.exec(board, col, x, y);
        board = res.board;
        return res.put;
    };
    Controller.disp = function(){
        for(var y=0; y < board.length; y++){
            for(var x=0; x < board[y].length; x++){
                $('#'+x+y).text(board[y][x]);
            }
        }
    };
    // initial
    Controller.disp();

    CPU = {};
    CPU.think = function(col){
        // 最初に見つけた置ける場所に置く
        for(var y=0; y < 8; y++){
            for(var x=0; x < 8; x++){
                var res = GameBoard.flipSearch(
                    board,
                    col, x, y, false
                );
                if (res){
                    GameBoard.exec(board, col, x, y);
                    return;
                }
            }
        }
    };

    $('button').click(function(){
        var id = $(this).attr('id');
        var res = Controller.put(player, id.charAt(0), id.charAt(1));
        if (res){
            CPU.think(2);
            Controller.disp();
/*
            if (player == 1){
                player = 2;
            }else{
                player = 1;
            }
*/
        }

    });

});