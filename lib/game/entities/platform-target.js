// EntityPlatformTarget

ig.module(
	'game.entities.platform-target'
)
.requires(
	'impact.entity'
)
.defines(function() {

////////////////////////////////////////////////////////////////////////////////////////////////////
EntityPlatformTarget = ig.Entity.extend({
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(0, 255, 0, 0.7)',
	_wmScalable: false,

	size: { x: 16, y: 8 },

	update: function() {},
	draw: function() {}
	
});

});
