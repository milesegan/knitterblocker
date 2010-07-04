/*
This file is part of Knitterblocker.

Knitterblocker is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Knitterblocker is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Knitterblocker.  If not, see <http://www.gnu.org/licenses/>.
*/

// our knitcanvas
(function ($) {
    $.fn.knitCanvas = function(pattern) {
        var canvas = $(this).get(0);
        var pattern = $(pattern);

        $(this).bind("paint", function () {
            var ctx = canvas.getContext("2d");
            var size = 4;
            var psizey = pattern.find("tr").length;
            var psizex = pattern.find("tr:first-child td").length;
            var palette = [];

            for (y = 0; y < psizey; y ++) {
                for (x = 0; x < psizex; x++) {
                    var cell = pattern.find("tr").get(y);
                    cell = $(cell).find("td").get(x);
                    palette[y] = palette[y] || [];
                    palette[y][x] = $(cell).css("background-color");
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
        });

        return this;
    };
})(jQuery);

// our palette object
(function ($) {
    $.fn.palette = function() {
        var e = $(this);
        var current = e.find(".current").css("background-color");
        e.data("current", current);
        e.data("background-color", e.find("a:first-child").css("background-color"));

        e.find("a").click(function () {
            e.find("a").removeClass("current");
            $(this).addClass("current");
            e.data("current", $(this).css("background-color"));
        });

        $(document).keypress(function (event) {
            if (event.keyCode >= 49 && event.keyCode <= 55) {
                event.preventDefault();
                var color = e.find("a").get(event.keyCode - 49);
                e.find("a").removeClass("current");
                $(color).addClass("current");
                e.data("current", $(color).css("background-color"));
            }
        });

        return this;
    };
})(jQuery);

// the pattern editor
(function ($) {
    $.fn.patternEditor = function(palette, canvas) {
        var palette = $(palette);
        var e = $(this);
        var canvas = $(canvas);

        function toggleCell() {
            var cell = $(this);
            var color = palette.data("current");
            var background = palette.data("background-color");
            if (cell.css("background-color") == color) {
                cell.css("background-color", background);
            }
            else {
                cell.css("background-color", color);
            }
            canvas.trigger('paint');
        }

        function addNumbering() {
            e.find("tr").each(function (i) {
                $(this).prepend("<th>" + (i + 1) + "</th>");
            });
            var psizex = e.find("tr:first-child td").length;
            var html = e.find("table").append("<tr></tr>");
            html.append("<th></th>");
            for (i = 0; i < psizex; i++) {
                html.append("<th>" + (i + 1) + "</th>");
            }
        }

        function clearNumbering() {
            e.find("tr:last-child").remove();
            e.find("th").remove();
        }

        e.find("td").live('click', toggleCell);
        e.find(".add-row").click(function () {
            clearNumbering();
            var width = e.find("tr:first-child td").size();
            var row = e.find(".grid").append("<tr></tr>");
            for (i = 0; i < width; i++) {
                e.find("tr:last-child").append("<td style='background: white'></td>");
            }
            addNumbering();
            canvas.trigger('paint');
        });

        e.find(".remove-row").click(function () {
            clearNumbering();
            e.find("tr:last-child").remove();
            addNumbering();
            canvas.trigger('paint');
        });

        e.find(".add-column").click(function () {
            clearNumbering();
            e.find("tr").each(function () {
                $(this).append("<td style='background: white'></td>");
            });
            addNumbering();
            canvas.trigger('paint');
        });

        e.find(".remove-column").click(function () {
            clearNumbering();
            e.find("tr td:last-child").each(function () {
                $(this).remove();
            });
            addNumbering();
            canvas.trigger('paint');
        });

        e.find(".clear-all").click(function () {
            e.find("td").css("background-color", palette.data("background-color"));
            canvas.trigger('paint');
        });

        e.find(".fill-color").click(function () {
            var color = palette.data("current");
            e.find("td").css("background-color", color);
            canvas.trigger('paint');
        });

        addNumbering();
        return this;
    };
})(jQuery);

$(document).ready(function () {
    $("#palette").palette();
    $("#pattern").patternEditor("#palette", "#canvas");
    $("#canvas").knitCanvas("#pattern");
    $("#canvas").trigger('paint');
});
