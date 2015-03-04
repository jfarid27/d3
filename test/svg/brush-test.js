var vows = require("vows"),
    _ = require("../../"),
    load = require("../load"),
    assert = require("../assert");

var suite = vows.describe("d3.svg.brush");

suite.addBatch({
  "brush": {
    topic: load("svg/brush").expression("d3.svg.brush").document(),

    "x": {
      "defaults to null": function(brush) {
        assert.isNull(brush().x());
      }
    },

    "y": {
      "defaults to null": function(brush) {
        assert.isNull(brush().y());
      }
    },
    "type": {
      "defaults to 'points'": function(brush) {
        assert.equal(brush().type(), 'points');
      },
      "when updated":{
        "with 'points'":{
          "should set the type to 'points'": function(brush){
            var b = brush().type('points')
            assert.equal(b.type(), 'points');
          }
        },
        "with 'ranges'":{
          "should set the type to 'ranges'": function(brush){
            var b = brush().type('ranges')
            assert.equal(b.type(), 'ranges');
          }
        }
      }
    },

    "clamp": {
      "returns null when no scales are attached": function(brush) {
        assert.isNull(brush().clamp());
      },
      "returns a single boolean if only x is defined": function(brush) {
        var b = brush().x(_.scale.linear());
        assert.isTrue(b.clamp());
      },
      "returns a single boolean if only y is defined": function(brush) {
        var b = brush().y(_.scale.linear());
        assert.isTrue(b.clamp());
      },
      "returns one-dimensional array if both x and y are defined": function(brush) {
        var b = brush().x(_.scale.linear()).y(_.scale.linear());
        assert.deepEqual(b.clamp(), [true, true]);
      },
      "takes a single boolean if only x is defined": function(brush) {
        var b = brush().x(_.scale.linear()).clamp(false);
        assert.isFalse(b.clamp());
      },
      "takes a single boolean if only y is defined": function(brush) {
        var b = brush().y(_.scale.linear()).clamp(false);
        assert.isFalse(b.clamp());
      },
      "takes a one-dimensional array if both x and y are defined": function(brush) {
        var b = brush().x(_.scale.linear()).y(_.scale.linear()).clamp([false, true]);
        assert.deepEqual(b.clamp(), [false, true]);
        b.clamp([true, false]);
        assert.deepEqual(b.clamp(), [true, false]);
      }
    },

    "extent": {
      "returns null when no scales are attached": function(brush) {
        assert.isNull(brush().extent());
      },
      "returns a one-dimensional array if only x is defined": function(brush) {
        var b = brush().x(_.scale.linear());
        assert.deepEqual(b.extent(), [0, 0]);
      },
      "takes a one-dimensional array if only x is defined": function(brush) {
        var b = brush().x(_.scale.linear()).extent([0.1, 0.4]);
        assert.deepEqual(b.extent(), [0.1, 0.4]);
      },
      "returns a one-dimensional array if only y is defined": function(brush) {
        var b = brush().y(_.scale.linear());
        assert.deepEqual(b.extent(), [0, 0]);
      },
      "takes a one-dimensional array if only y is defined": function(brush) {
        var b = brush().y(_.scale.linear()).extent([0.1, 0.4]);
        assert.deepEqual(b.extent(), [0.1, 0.4]);
      },
      "returns a two-dimensional array if x and y are defined": function(brush) {
        var b = brush().x(_.scale.linear()).y(_.scale.linear());
        assert.deepEqual(b.extent(), [[0, 0], [0, 0]]);
      },
      "takes a two-dimensional array if x and y are defined": function(brush) {
        var b = brush().x(_.scale.linear()).y(_.scale.linear()).extent([[0.1, 0.2], [0.3, 0.4]]);
        assert.deepEqual(b.extent(), [[0.1, 0.2], [0.3, 0.4]]);
      },
      "preserves the set extent exactly": function(brush) {
        var lo = Number(0.1),
            hi = Number(0.3),
            b = brush().x(_.scale.linear()).extent([lo, hi]),
            extent = b.extent();
        assert.strictEqual(extent[0], lo);
        assert.strictEqual(extent[1], hi);
      },
      "with defined x and y": {
        topic: function(brush){
          var domain_lo_x = Number(0),
              domain_hi_x = Number(1),
              domain_lo_y = Number(0),
              domain_hi_y = Number(1)

          return {
            brush: brush,
            x_scale: _.scale.linear().domain([domain_lo_x, domain_hi_x]),
            y_scale: _.scale.linear().domain([domain_lo_y, domain_hi_y]),
          }

        },
        "after setting an event start extent": {
          topic: function(prev){

            prev.extent = {
              start_x: Number(.25),
              start_y: Number(.75),
              end_x: Number(.75),
              end_y: Number(.25)
            }

            return prev
            
          },
          "should return the defined extent ": function(topic){

            var b = topic.brush()
              .x(topic.x_scale)
              .y(topic.y_scale)
               .extent([[topic.extent.start_x, topic.extent.start_y], [topic.extent.end_x,topic.extent.end_y]]),
            extent = b.extent();

            assert.strictEqual(extent[0][0], topic.extent.start_x);
            assert.strictEqual(extent[0][1], topic.extent.start_y);
            assert.strictEqual(extent[1][0], topic.extent.end_x);
            assert.strictEqual(extent[1][1], topic.extent.end_y);
          },
        },
        "when type is set to 'points'":{
          topic: function(prev){
            prev.extent_type = 'points'
            return prev
          },
          "after setting an event start extent": {
            topic: function(prev){

              prev.extent = {
                start_x: Number(.25),
                start_y: Number(.75),
                end_x: Number(.75),
                end_y: Number(.25)
              }

              return prev
              
            },
            "should return the defined extent ": function(topic){

              var b = topic.brush()
                .type(topic.extent_type)
                .x(topic.x_scale)
                .y(topic.y_scale)
                .extent([[topic.extent.start_x, topic.extent.start_y], [topic.extent.end_x,topic.extent.end_y]]),
                extent = b.extent();

              assert.strictEqual(extent[0][0], topic.extent.start_x);
              assert.strictEqual(extent[0][1], topic.extent.start_y);
              assert.strictEqual(extent[1][0], topic.extent.end_x);
              assert.strictEqual(extent[1][1], topic.extent.end_y);
            },
          },
        },
        "when type is set to 'ranges'":{
          topic: function(prev){
            prev.extent_type = 'ranges'
            return prev
          },
          "after setting an event start extent": {
            topic: function(prev){

              prev.extent = {
                start_x: Number(.25),
                start_y: Number(.75),
                end_x: Number(.75),
                end_y: Number(.25)
              }
              return prev
              
            },
            "should return the defined extent ": function(topic){

              var b = topic.brush()
                .type(topic.extent_type)
                .x(topic.x_scale)
                .y(topic.y_scale)
                .extent([[topic.extent.start_x, topic.extent.start_y], [topic.extent.end_x,topic.extent.end_y]]),
              extent = b.extent();

              assert.strictEqual(extent[0][0], topic.extent.start_x);
              assert.strictEqual(extent[0][1], topic.extent.end_x);
              assert.strictEqual(extent[1][0], topic.extent.start_y);
              assert.strictEqual(extent[1][1], topic.extent.end_y);
            },
          },
        },
      },

    },

    "empty": {
      "returns true if and only if any defined extent is empty": function(brush) {
        var b = brush();
        assert.strictEqual(b.empty(), false); // x and y are undefined
        var b = brush().x(_.scale.linear());
        assert.strictEqual(b.empty(), true); // x is empty, y is undefined
        assert.strictEqual(b.extent([0, 1]).empty(), false); // x is non-empty, y is undefined
        var b = brush().y(_.scale.linear());
        assert.strictEqual(b.empty(), true); // x is undefined, y is empty
        assert.strictEqual(b.extent([0, 1]).empty(), false); // x is undefined, y is non-empty
        var b = brush().x(_.scale.linear()).y(_.scale.linear());
        assert.strictEqual(b.empty(), true); // x is empty, y is empty
        assert.strictEqual(b.extent([[0, 0], [1, 0]]).empty(), true); // x is non-empty, y is empty
        assert.strictEqual(b.extent([[0, 0], [0, 1]]).empty(), true); // x is empty, y is non-empty
        assert.strictEqual(b.extent([[0, 0], [1, 1]]).empty(), false); // x is non-empty, y is non-empty
      }
    }
  }
});

suite.export(module);
