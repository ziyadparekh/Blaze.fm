/*global $*/
define(
    ['marionette',
    'templates'],
    function(marionette, templates){
        "use strict";

        var app = new marionette.Application();
        app.currentProfile = "";
        app.addRegions({
            header        : '#header',
            full          : '#full',
            profilecenter : '#profilecenter',
            profileleft   : '#profileleft',
            left          : '#left',
            center        : '#center',
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