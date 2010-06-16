function paint(canvas, pattern) {
    var ctx = canvas.getContext("2d");
    var size = 5;
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

$(document).ready(function () {
    var canvas = $('#canvas').get(0);
    var pattern = $("#pattern");
    paint(canvas, pattern);
});
