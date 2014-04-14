var app;
define(
    ['marionette'],
    function(marionette){
        "use strict";

        app = new marionette.Application();
        app.addRegions({
            header        : '#header',
            center        : '#center',
            main          : '#main',
            navigation    : '#navigation',
            left          : '#leftmenuwrap',
            queue         : '#queue',
            player        : '#audio-wrap',
        });
        app.strip = function(str) {
            return (str + '').replace(/\\(.?)/g, function (s, n1) {
                switch (n1) {
                    case '\\':
                    return '\\';
                    case '0':
                    return '\u0000';
                    case '':
                    return '';
                    default:
                    return n1;
                }
            });
        }

        return app;

    }
    );