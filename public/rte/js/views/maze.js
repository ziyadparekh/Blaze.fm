define(['marionette',
	'backbone',
	'app',
	'templates',
	'd3',
	],
	function (Marionette, Backbone, app, templates, d3){
		return Backbone.View.extend({
			initialize: function(options){
				this.options = options || {};
			},
			render: function(){
				this.loadProfileMaze();
			},
			loadProfileMaze: function(){
				var containerWidth = document.getElementById("canvas-container").offsetWidth,
				width = containerWidth,
				height = 170;

				var N = 1 << 0,
				S = 1 << 1,
				W = 1 << 2,
				E = 1 << 3;

				var canvas = d3.select(this.el).append("canvas")
				.attr("width", width)
				.attr("height", height);

				var cells,
				context = canvas.node().getContext("2d"),
				image = context.createImageData(1, 1),
				distance = d3.range(width * height).map(function() { return 0; }),
				frontier = [(height - 1) * width];

				var mazeWorker = new Worker("/rte/js/lib/mazeHelper.js");

				mazeWorker.postMessage({width: width, height: height});

				mazeWorker.addEventListener("message", function(event) {
					mazeWorker.terminate();

					cells = event.data;

					d3.timer(function() {
						for (var i = 0; i < 100; ++i) {
							if (exploreFrontier()) {
								return true;
							}
						}
					});
				});

				function exploreFrontier() {
					if ((i0 = popRandom(frontier)) == null) return true;

					var i0,
					i1,
					d0 = distance[i0],
					d1 = d0 + .25,
					c0 = d3.hsl(d0 % 360, 1, .5).rgb();

					image.data[0] = c0.r;
					image.data[1] = c0.g;
					image.data[2] = c0.b;
					image.data[3] = 255;
					context.putImageData(image, i0 % width, i0 / width | 0);

					if (cells[i0] & E && !distance[i1 = i0 + 1]) distance[i1] = d1, frontier.push(i1);
					if (cells[i0] & W && !distance[i1 = i0 - 1]) distance[i1] = d1, frontier.push(i1);
					if (cells[i0] & S && !distance[i1 = i0 + width]) distance[i1] = d1, frontier.push(i1);
					if (cells[i0] & N && !distance[i1 = i0 - width]) distance[i1] = d1, frontier.push(i1);
				}

				function popRandom(array) {
					if (!(n = array.length)) return;
					var n, i = Math.random() * n | 0, t;
					t = array[i], array[i] = array[n - 1], array[n - 1] = t;
					return array.pop();
				}
			}

		});

});