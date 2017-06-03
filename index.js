$(function(){
    board = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,-1,1,0,0,0],
    [0,0,0,1,-1,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
    ];
    player = 1;

    log = function(log){
        var str = $('#log').html();
        $('#log').html(
             (str+log+'<br>')
        );
    }

    cloneBoard = function(){
        var clo = [];
        board.forEach(function(line){
            clo.push(line.concat());
        })
        return clo;
    }

    GameBoard = {};
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
        var lineSearch = function(b, col, sx, sy, x, y, f = false){
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
                flipList = [];
                return true; //自コマなので探索終了
            }
            else if( b[py][px] !== col){
                flipList.push([py, px]); // 相手コマなのでキャッシュ
                return lineSearch(b, col, px, py, x, y, f); // 再帰探索
            }
        };

        // 先ずは探索
        // 8方向
        var res = false;
        //上
        res = (lineSearch(b, col, x, y, 0, -1, f) || res);
        //右上
        res = (lineSearch(b, col, x, y, 1, -1, f) || res);
        //右
        res = (lineSearch(b, col, x, y, 1, 0, f) || res);
        //右下
        res = (lineSearch(b, col, x, y, 1, 1, f) || res);
        //下
        res = (lineSearch(b, col, x, y, 0, 1, f) || res);
        //左下
        res = (lineSearch(b, col, x, y, -1, 1, f) || res);
        //左
        res = (lineSearch(b, col, x, y, -1, 0, f) || res);
        //左上
        res = (lineSearch(b, col, x, y, -1, -1, f) || res);

        if(f && res){
            b[y][x] = col;
        }

        return res;
    };
    // コマを置く
    GameBoard.exec = function( board, col, x, y ){
        x = parseInt(x,10);
        y = parseInt(y,10);

        // 盤面更新
        var f = GameBoard.flipSearch(board, col, x, y, true);

        // 盤面の結果を復帰
        return {
            board: board,
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
                var elem = $('#'+x+y);
                elem.css('width', '40px').css('height', '40px').css('padding', '0').css('border', '0');
                if(board[y][x] == 1){
                    elem.html('<img src="1.png" style="width: 40px; height: 40px;">');
                }
                else if(board[y][x] == -1){
                    elem.html('<img src="_1.png" style="width: 40px; height: 40px;">');
                }
            }
        }
    };
    // initial
    Controller.disp();

    $('button').click(function(){
        var id = $(this).attr('id');
        var res = Controller.put(player, id.charAt(0), id.charAt(1));
        Controller.disp();
        if (res){
            setTimeout(function(){
                CPU.think(-(player));
                Controller.disp();
            }, 500);
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