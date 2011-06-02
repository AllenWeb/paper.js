/*
 * Paper.js
 *
 * This file is part of Paper.js, a JavaScript Vector Graphics Library,
 * based on Scriptographer.org and designed to be largely API compatible.
 * http://paperjs.org/
 * http://scriptographer.org/
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * Copyright (c) 2011, Juerg Lehni & Jonathan Puckey
 * http://lehni.org/ & http://jonathanpuckey.com/
 *
 * All rights reserved.
 */

var GradientColor = this.GradientColor = Color.extend({
	/** @lends GradientColor# */

	beans: true,

	/**
	 * Creates a gradient color object.
	 * 
	 * @param {Gradient} gradient
	 * @param {Point} origin
	 * @param {Point} destination
	 * @param {Point} [hilite]
	 * @constructs GradientColor
	 * 
	 * @class The GradientColor object.
	 */
	initialize: function(gradient, origin, destination, hilite) {
		this.gradient = gradient || new Gradient();
		this.setOrigin(origin);
		this.setDestination(destination);
		if (hilite)
			this.setHilite(hilite);
	},

	/**
	 * @return {GradientColor} a copy of the gradient color
	 */
	clone: function() {
		return new GradientColor(this.gradient, this._origin, this._destination,
				this._hilite);
	},

	/**
	 * The origin point of the gradient.
	 * 
	 * @type Point
	 * @bean
	 */
	getOrigin: function() {
		return this._origin;
	},

	setOrigin: function(origin) {
		// PORT: Add clone to Scriptographer
		origin = Point.read(arguments).clone();
		this._origin = origin;
		if (this._destination)
			this._radius = this._destination.getDistance(this._origin);
		return this;
	},

	/**
	 * The destination point of the gradient.
	 * 
	 * @type Point
	 * @bean
	 */
	getDestination: function() {
		return this._destination;
	},

	setDestination: function(destination) {
		// PORT: Add clone to Scriptographer
		destination = Point.read(arguments).clone();
		this._destination = destination;
		this._radius = this._destination.getDistance(this._origin);
		return this;
	},

	/**
	 * The hilite point of the gradient.
	 * 
	 * @type Point
	 * @bean
	 */
	getHilite: function() {
		return this._hilite;
	},

	setHilite: function(hilite) {
		// PORT: Add clone to Scriptographer
		hilite = Point.read(arguments).clone();
		var vector = hilite.subtract(this._origin);
		if (vector.getLength() > this._radius) {
			this._hilite = this._origin.add(
					vector.normalize(this._radius - 0.1));
		} else {
			this._hilite = hilite;
		}
		return this;
	},

	getCanvasStyle: function(ctx) {
		var gradient;
		if (this.gradient.type === 'linear') {
			gradient = ctx.createLinearGradient(this._origin.x, this._origin.y,
					this._destination.x, this._destination.y);
		} else {
			var origin = this._hilite || this._origin;
			gradient = ctx.createRadialGradient(origin.x, origin.y,
					0, this._origin.x, this._origin.y, this._radius);
		}
		for (var i = 0, l = this.gradient._stops.length; i < l; i++) {
			var stop = this.gradient._stops[i];
			gradient.addColorStop(stop._rampPoint, stop._color.toCssString());
		}
		return gradient;
	},

	/**
	 * Checks if the gradient color has the same properties as that of the
	 * supplied one.
	 * 
	 * @param {GradientColor} color
	 * @return {@true the GradientColor is the same}
	 */
	equals: function(color) {
		return color == this || color && color._colorType === this._colorType
				&& this.gradient.equals(color.gradient)
				&& this._origin.equals(color._origin)
				&& this._destination.equals(color._destination);
	},

	/**
	 * Transform the gradient color by the specified matrix.
	 * 
	 * @param {Matrix} matrix the matrix to transform the gradient color by
	 */
	transform: function(matrix) {
		matrix._transformPoint(this._origin, this._origin, true);
		matrix._transformPoint(this._destination, this._destination, true);
		if (this._hilite)
			matrix._transformPoint(this._hilite, this._hilite, true);
		this._radius = this._destination.getDistance(this._origin);
	}
});

