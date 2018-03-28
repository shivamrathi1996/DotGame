var gameArea = $('#game-area');

function Cell(row, col) {
    this.row = row;
    this.col = col;
    this.element = null;

    Cell.filledClass = 'filled';
    Cell.selectedClass = 'selected';
    Cell.itemClass = 'item';

    this.fill = function() {
        this.element.addClass(Cell.filledClass);
        return this;
    };

    this.empty = function() {
        this.element.removeClass(Cell.filledClass);
        return this;
    };

    this.isFilled = function() {
        return this.element.hasClass(Cell.filledClass);
    };

    this.select = function() {
        this.element.addClass(Cell.selectedClass);
        return this;
    };

    this.unselect = function() {
        this.element.removeClass(Cell.selectedClass);
        return this;
    };

    this.init = function() {
        this.element = $('<div></div>')
            .data({'row': this.row, 'col': this.col})
            .attr({'id': 'item-' + this.row + '-' + this.col, 'class': Cell.itemClass + ' ' + Cell.filledClass});
        gameArea.append(this.element);
        return this;
    };
}

function Game(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.cells = [];
    this.currentCell = null;

    this.init = function() {
        gameArea.html('');
        for (var row = 1; row <= this.rows; row++) {
            var r = [];
            for (var col = 1; col <= this.cols; col++) {
                r[col - 1] = new Cell(row, col).init();
            }
            this.cells[row - 1] = r;
            gameArea.append('<br/>');
        }

        this.getCell(Math.ceil(Math.random() * this.rows), Math.ceil(Math.random() * this.cols)).empty();

        $("." + Cell.itemClass, gameArea).on('click', { 'game' : this}, cellClickHandler);
    };

    this.getCell = function(row, col) {
        return this.cells[row - 1][col - 1];
    };

    this.filledCellsLeft = function () {
        var total = 0;
        for (row = 1; row <= this.rows; row++) {
            for (col = 1; col <= this.cols; col++) {
                if (this.getCell(row, col).isFilled()) {
                    total++;
                }
            }
        }
        return total;
    };

    this.hasMovesLeft = function () {
        for (row = 1; row <= this.rows; row++) {
            for (col = 1; col <= this.cols; col++) {
                if (this.getCell(row, col).isFilled()) {
                    if ((col > 1 && this.getCell(row, col - 1).isFilled()) // check left
                        || (col < this.cols && this.getCell(row, col + 1).isFilled()) // check right
                        || (row > 1 && this.getCell(row - 1, col).isFilled()) // check top
                        || (row < this.rows && this.getCell(row + 1, col).isFilled())) { // check bottom
                        return true;
                    }
                }
            }
        }
        return false;
    }
}

function cellClickHandler(event) {
    game = event.data.game;
    var cell = game.getCell($(this).data('row'), $(this).data('col'));

    if (cell.isFilled()) {
        if (!game.currentCell) {
            cell.select();
            game.currentCell = cell;
        } else {
            game.currentCell.unselect();
            game.currentCell = null;
        }
    }
    else if (game.currentCell) {
        var rowDiff = Math.abs(game.currentCell.row - cell.row), colDiff = Math.abs(game.currentCell.col - cell.col);
        if ((colDiff === 0 || colDiff === 2)
            && (rowDiff === 0 || rowDiff === 2)
            && ((colDiff === 2 && rowDiff === 0) || (colDiff === 0 && rowDiff === 2))) {
            var over = game.getCell((game.currentCell.row + cell.row) / 2, (game.currentCell.col + cell.col) / 2);
            if (over.isFilled()) {
                cell.fill();
                over.empty();
                game.currentCell.empty().unselect();

                if (game.filledCellsLeft() == 1) {
                    alert(':) You Win!!');
                }
                else if (!game.hasMovesLeft()) {
                    // You lose!
                    alert(':( No moves left. You lose.');
                }
            }
        }
    }
}

$(function() {
    var game = new Game(4, 4);
    game.init();
    $('#reset-form').on("submit", function(event) {
        event.preventDefault();
        new Game(parseInt($("#rows").val()), parseInt($("#cols").val())).init();
        $("#game-area").show();
        $("#form, #how-to").hide();
    });

    $('#new-game').on('click', function() {
        $("#form").show();
        $("#game-area, #how-to").hide();
    });

    $('#rules').on('click', function() {
        $("#how-to").show();
        $("#game-area, #form").hide();
    });
});