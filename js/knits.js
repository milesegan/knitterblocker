function paint() {
    var canvas = $("#canvas").get(0);
    var pattern = $("#pattern");
    var ctx = canvas.getContext("2d");
    var size = 4;
    var psizey = $("tr", pattern).length;
    var psizex = $("tr:first-child td", pattern).length;
    var palette = [];

    for (y = 0; y < psizey; y ++) {
        for (x = 0; x < psizex; x++) {
            var cell = $("tr", pattern).get(y);
            cell = $("td", cell).get(x);
            palette[y] = palette[y] || [];
            palette[y][x] = $(cell).css("background");
        }
    }

    for (y = 0; y < canvas.height; y += size) {
        for (x = 0; x < canvas.width; x += size) {
            var px = (x / size) % psizex;
            var py = (y / size) % psizey;
            var color = palette[py][px];
            ctx.fillStyle = color;
            ctx.fillRect(x, y, size, size); 
        }
    }
}

function toggle_cell(e) {
    e = $(e);
    if (e.css("background") == "black") {
        e.css("background", "white");
    }
    else {
        e.css("background", "black");
    }
}

function add_column() {
    $("#pattern tr").each(function () {
        $(this).append("<td style='background: white'></td>");
    });
    paint();
}

function remove_column() {
    $("#pattern tr td:last-child").each(function () {
        $(this).remove();
    });
    paint();
}

function add_row() {
    var width = $("#pattern tr:first-child td").size();
    var row = $("#pattern").append("<tr></tr>");
    for (i = 0; i < width; i++) {
        $("#pattern tr:last-child").append("<td style='background: white'></td>");
    }
    paint();
}

function remove_row() {
    $("#pattern tr:last-child").remove();
    paint();
}

$(document).ready(function () {
    var canvas = $('#canvas').get(0);
    var pattern = $("#pattern");

    $("#pattern td").live('click', function () {
        toggle_cell(this);
        paint();
    });

    $("#add-column").click(add_column);
    $("#remove-column").click(remove_column);
    $("#add-row").click(add_row);
    $("#remove-row").click(remove_row);

    paint();
});
