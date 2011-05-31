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

var Symbol = this.Symbol = Base.extend({
	/** @lends Symbol# */

	beans: true,

	/**
	 * Creates a Symbol item.
	 * 
	 * @param {Item} item the source item which is copied as the definition of
	 *               the symbol
	 *
	 * @name Symbol
	 * @constructor
	 * 
	 * @example
	 * var circlePath = new Path.Circle(new Point(100, 100), 50);
	 * circlePath.fillColor = 'red';
	 * 
	 * var circleSymbol = new Symbol(circlePath);
	 * 
	 * // The original item is still contained in the document:
	 * circlePath.remove();
	 * 
	 * // Place an instance of the symbol in the document:
	 * var placedCircle = new PlacedSymbol(circleSymbol);
	 * 
	 * // Move the placed symbol to {x: 150, y: 150}:
	 * placedCircle.position = new Point(150, 150);
	 * 
	 * @class Symbols allow you to place multiple instances of an item in your
	 *        project. This can save memory, since all instances of a symbol
	 *        simply refer to the original item and it can speed up moving
	 *        around complex objects, since internal properties such as segment
	 *        lists and gradient positions don't need to be updated with every
	 *        transformation.
	 */
	initialize: function(item) {
		this.project = paper.project;
		this.project.symbols.push(this);
		this.setDefinition(item);
	},

	// TODO: Symbol#remove()
	// TODO: Size#name (accessible by name through project#symbols)

	/**
	 * The project that this symbol belongs to.
	 * 
	 * @type Project
	 * @readonly
	 * @name Symbol#project
	 */

	/**
	 * The symbol definition.
	 * 
	 * @type Item
	 * @bean
	 */
	getDefinition: function() {
		return this._definition;
	},

	setDefinition: function(item) {
		this._definition = item;
		// Deselect the item, as PlacedSymbol has its own selection.
		item.setSelected(false);
		item._removeFromParent();
		// Move position to 0, 0. TODO: Why?
		item.setPosition(new Point());
	},

	/**
	 * Returns a copy of the symbol.
	 * 
	 * @return {Symbol}
	 */
	clone: function() {
	 	return new Symbol(this._definition.clone());
	}
});
