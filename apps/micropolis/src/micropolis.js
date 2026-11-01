/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 274:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
*
* This code is released under the GNU GPL v3, with some additional terms.
* Please see the files LICENSE and COPYING for details. Alternatively,
* consult http://micropolisjs.graememcc.co.uk/LICENSE and
* http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
*
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Tile = void 0;
var TileFlags = __importStar(__webpack_require__(851));
var tileValues_1 = __webpack_require__(680);
var Tile = /** @class */ (function () {
    function Tile(value, flags) {
        if (value === void 0) { value = tileValues_1.DIRT; }
        if (flags === void 0) { flags = 0; }
        this.validateArguments(value, flags, "Tile constructor");
        this.value = value | flags;
    }
    Tile.prototype.getValue = function () {
        return this.valueFromCombinedValue(this.value);
    };
    Tile.prototype.getFlags = function () {
        return this.flagsFromCombinedValue(this.value);
    };
    Tile.prototype.getRawValue = function () {
        // TODO: Can we remove the caller of this to avoid leaking this implementation detail?
        return this.value;
    };
    Tile.prototype.addFlags = function (flags) {
        this.validateFlags(flags, "addFlags");
        if (flags === TileFlags.NOFLAGS) {
            return;
        }
        this.value |= flags;
    };
    Tile.prototype.setValue = function (desiredValue) {
        if (desiredValue < tileValues_1.TILE_INVALID) {
            throw new Error("setValue called with out-of-range value ".concat(desiredValue));
        }
        // TODO: Fix cases where this can be called with a "combined" value + flags value so we can simplify
        var value = this.valueFromCombinedValue(desiredValue);
        var bitMask = this.flagsToSetFromCombinedValue(desiredValue);
        this.set(value, bitMask);
    };
    Tile.prototype.setFlags = function (flags) {
        this.validateFlags(flags, "setFlags");
        var existingValue = this.value & ~TileFlags.ALLBITS;
        this.value = existingValue | flags;
    };
    Tile.prototype.removeFlags = function (flags) {
        this.validateFlags(flags, "removeFlags");
        if (flags === TileFlags.NOFLAGS) {
            return;
        }
        this.value &= ~flags;
    };
    Tile.prototype.setFrom = function (tile) {
        this.value = tile.value;
    };
    Tile.prototype.set = function (value, flags) {
        this.validateArguments(value, flags, "set");
        this.value = value | flags;
    };
    Tile.prototype.isAnimated = function () {
        return this.checkBits(TileFlags.ANIMBIT);
    };
    Tile.prototype.isBulldozable = function () {
        return this.checkBits(TileFlags.BULLBIT);
    };
    Tile.prototype.isConductive = function () {
        return this.checkBits(TileFlags.CONDBIT);
    };
    Tile.prototype.isCombustible = function () {
        return this.checkBits(TileFlags.BURNBIT);
    };
    Tile.prototype.isPowered = function () {
        return this.checkBits(TileFlags.POWERBIT);
    };
    Tile.prototype.isZone = function () {
        return this.checkBits(TileFlags.ZONEBIT);
    };
    Tile.prototype.toString = function () {
        var _this = this;
        var qualities = ["animated", "bulldozable", "combustible", "conductive", "powered", "zone"];
        var qualitiesText = qualities.map(function (quality) { return _this.getQualityText(quality); }).join(", ");
        var tileValue = this.getValue();
        return "Tile# ".concat(tileValue, ": ").concat(qualitiesText);
    };
    Tile.prototype.getQualityText = function (quality) {
        var predicate = this.predicateForQuality(quality);
        var qualityValue = this[predicate]();
        return "".concat(quality, ": ").concat(this.summariseBoolean(qualityValue));
    };
    Tile.prototype.predicateForQuality = function (quality) {
        return "is".concat(quality[0].toUpperCase()).concat(quality.slice(1));
    };
    Tile.prototype.summariseBoolean = function (bool) {
        return bool ? "\u2714" : "\u2718";
    };
    Tile.prototype.valueFromCombinedValue = function (value) {
        return value & TileFlags.BIT_MASK;
    };
    Tile.prototype.flagsFromCombinedValue = function (value) {
        return value & TileFlags.ALLBITS;
    };
    Tile.prototype.flagsToSetFromCombinedValue = function (value) {
        var embeddedFlags = this.flagsFromCombinedValue(value);
        return embeddedFlags > 0 ? embeddedFlags : this.getFlags();
    };
    Tile.prototype.checkBits = function (flag) {
        return (this.value & flag) > 0;
    };
    Tile.prototype.validateArguments = function (value, flags, context) {
        this.validateValue(value, context);
        this.validateFlags(flags, context);
    };
    Tile.prototype.validateValue = function (value, context) {
        if (this.valueIsInvalid(value)) {
            throw new Error("".concat(context, " called with out-of-range value ").concat(value));
        }
    };
    Tile.prototype.validateFlags = function (flags, context) {
        if (this.flagsAreInvalid(flags)) {
            throw new Error("".concat(context, " called with out-of-range flags 0x").concat(flags.toString(16)));
        }
    };
    Tile.prototype.valueIsInvalid = function (value) {
        return value < tileValues_1.TILE_INVALID || value >= tileValues_1.TILE_COUNT;
    };
    Tile.prototype.flagsAreInvalid = function (flags) {
        return flags !== 0 && (flags < TileFlags.BIT_START || (flags & ~TileFlags.ALLBITS) !== 0);
    };
    return Tile;
}());
exports.Tile = Tile;


/***/ }),

/***/ 353:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;

/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */
__webpack_unused_export__ = ({ value: true });
exports.K = void 0;
exports.K = 'data:image/png;base64,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';


/***/ }),

/***/ 363:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;

/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */
__webpack_unused_export__ = ({ value: true });
exports.c = void 0;
var position_1 = __webpack_require__(973);
var Bounds = /** @class */ (function () {
    function Bounds(inclusiveStartX, inclusiveStartY, widthCount, heightCount) {
        // assert(widthCount > 0, "bounded region must have a width");
        // assert(heightCount > 0, "bounded region must have a width");
        this.inclusiveStartX = inclusiveStartX;
        this.inclusiveStartY = inclusiveStartY;
        this.exclusiveEndX = inclusiveStartX + widthCount;
        this.exclusiveEndY = inclusiveStartY + heightCount;
    }
    Bounds.fromOrigin = function (width, height) {
        return new Bounds(0, 0, width, height);
    };
    Bounds.prototype.contains = function (position) {
        var x = position.x, y = position.y;
        return this.xInBounds(x) && this.yInBounds(y);
    };
    Bounds.prototype.toString = function () {
        var upperCorner = new position_1.Position(this.inclusiveStartX, this.inclusiveStartY);
        var lowerCorner = new position_1.Position(this.exclusiveEndX - 1, this.exclusiveEndY - 1);
        return "Bounds Rectangle: ".concat(upperCorner, " - ").concat(lowerCorner);
    };
    Bounds.prototype.xInBounds = function (x) {
        return x >= this.inclusiveStartX && x < this.exclusiveEndX;
    };
    Bounds.prototype.yInBounds = function (y) {
        return y >= this.inclusiveStartY && y < this.exclusiveEndY;
    };
    return Bounds;
}());
exports.c = Bounds;


/***/ }),

/***/ 441:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NORTHWEST = exports.WEST = exports.SOUTHWEST = exports.SOUTH = exports.SOUTHEAST = exports.EAST = exports.NORTHEAST = exports.NORTH = void 0;
exports.forEachCardinalDirection = forEachCardinalDirection;
exports.getRandomCardinalDirection = getRandomCardinalDirection;
exports.getRandomDirection = getRandomDirection;
var random_1 = __webpack_require__(737);
var DirectionValue = /** @class */ (function () {
    function DirectionValue(name) {
        this.name = name;
    }
    DirectionValue.prototype.oppositeDirection = function () {
        return this.transform(4);
    };
    DirectionValue.prototype.rotateClockwise = function () {
        return this.transform(1);
    };
    DirectionValue.prototype.rotateCounterClockwise = function () {
        return this.transform(allDirections.length - 1);
    };
    DirectionValue.prototype.toString = function () {
        return this.name;
    };
    DirectionValue.prototype.transform = function (delta) {
        var ourIndex = directionIndex(this);
        var desired = ourIndex + delta;
        return allDirections[desired % allDirections.length];
    };
    return DirectionValue;
}());
exports.NORTH = Object.freeze(new DirectionValue("NORTH"));
exports.NORTHEAST = Object.freeze(new DirectionValue("NORTHEAST"));
exports.EAST = Object.freeze(new DirectionValue("EAST"));
exports.SOUTHEAST = Object.freeze(new DirectionValue("SOUTHEAST"));
exports.SOUTH = Object.freeze(new DirectionValue("SOUTH"));
exports.SOUTHWEST = Object.freeze(new DirectionValue("SOUTHWEST"));
exports.WEST = Object.freeze(new DirectionValue("WEST"));
exports.NORTHWEST = Object.freeze(new DirectionValue("NORTHWEST"));
var allDirections = [
    exports.NORTH,
    exports.NORTHEAST,
    exports.EAST,
    exports.SOUTHEAST,
    exports.SOUTH,
    exports.SOUTHWEST,
    exports.WEST,
    exports.NORTHWEST,
];
function directionIndex(direction) {
    return allDirections.indexOf(direction);
}
var cardinalDirections = [
    exports.NORTH,
    exports.EAST,
    exports.SOUTH,
    exports.WEST,
];
function forEachCardinalDirection(callback) {
    cardinalDirections.forEach(function (dir) { return callback(dir); });
}
function getRandomCardinalDirection() {
    return getRandomDirectionFrom(cardinalDirections);
}
function getRandomDirection() {
    return getRandomDirectionFrom(allDirections);
}
function getRandomDirectionFrom(directionArray) {
    var maxIndex = directionArray.length - 1;
    var index = random_1.Random.getRandom(maxIndex);
    return directionArray[index];
}


/***/ }),

/***/ 639:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;

/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */
__webpack_unused_export__ = ({ value: true });
exports.Q = void 0;
var ID = function (n) { return n; };
/*
 *
 * BlockMaps are data maps where each entry corresponds to data representing a block of tiles in the original
 * game map.
 *
 */
var BlockMap = /** @class */ (function () {
    // Construct a block map. Takes three integers: the game map's width and height, and the block size (i.e. how many
    // tiles in each direction should map to the same block). The BlockMap entries will be initialised to zero.
    function BlockMap(gameMapWidth, gameMapHeight, blockSize) {
        this.gameMapWidth = gameMapWidth;
        this.gameMapHeight = gameMapHeight;
        this.blockSize = blockSize;
        this.data = [];
        this._width = this.convertToBlockCount(this.gameMapWidth);
        this._height = this.convertToBlockCount(this.gameMapHeight);
        this.clear();
    }
    Object.defineProperty(BlockMap.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BlockMap.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: false,
        configurable: true
    });
    BlockMap.prototype.get = function (blockX, blockY) {
        var index = this.toIndex(blockX, blockY);
        return this.data[index];
    };
    BlockMap.prototype.set = function (blockX, blockY, value) {
        var index = this.toIndex(blockX, blockY);
        this.data[index] = value;
    };
    BlockMap.prototype.worldGet = function (worldX, worldY) {
        var _a = this.toBlockCoordinate(worldX, worldY), x = _a.x, y = _a.y;
        return this.get(x, y);
    };
    BlockMap.prototype.worldSet = function (worldX, worldY, value) {
        var _a = this.toBlockCoordinate(worldX, worldY), x = _a.x, y = _a.y;
        this.set(x, y, value);
    };
    BlockMap.prototype.clear = function () {
        var _this = this;
        this.forEach(function (x, y) { return _this.set(x, y, 0); });
    };
    BlockMap.prototype.copyFrom = function (source, transform) {
        var _this = this;
        if (transform === void 0) { transform = ID; }
        if (this.hasIncompatibleDimensions(source)) {
            console.warn("Copying from incompatible blockMap!");
        }
        this.forEach(function (x, y) { return _this.set(x, y, transform(source.get(x, y))); });
    };
    BlockMap.prototype.forEach = function (fn) {
        var maxWidth = this.width;
        var maxHeight = this.height;
        for (var x = 0; x < maxWidth; x++) {
            for (var y = 0; y < maxHeight; y++) {
                fn(x, y);
            }
        }
    };
    BlockMap.prototype.convertToBlockCount = function (value) {
        return Math.floor((value + this.blockSize - 1) / this.blockSize);
    };
    BlockMap.prototype.hasIncompatibleDimensions = function (map) {
        return map.gameMapHeight !== this.gameMapHeight ||
            map.gameMapWidth !== this.gameMapWidth ||
            map.blockSize !== this.blockSize;
    };
    BlockMap.prototype.toBlockCoordinate = function (worldX, worldY) {
        var x = this.toBlockIndex(worldX);
        var y = this.toBlockIndex(worldY);
        return { x: x, y: y };
    };
    BlockMap.prototype.toBlockIndex = function (worldIndex) {
        return Math.floor(worldIndex / this.blockSize);
    };
    BlockMap.prototype.toIndex = function (blockX, blockY) {
        return this.width * blockY + blockX;
    };
    return BlockMap;
}());
exports.Q = BlockMap;


/***/ }),

/***/ 680:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BRWXXX1 = exports.BRWV = exports.LTRFBASE = exports.BRWH = exports.VROADPOWER = exports.HROADPOWER = exports.INTERSECTION = exports.ROADS10 = exports.ROADS9 = exports.ROADS8 = exports.ROADS7 = exports.ROADS6 = exports.ROADS5 = exports.ROADS4 = exports.ROADS3 = exports.ROADS2 = exports.ROADS = exports.VBRIDGE = exports.ROADBASE = exports.HBRIDGE = exports.LASTFIRE = exports.FIREBASE = exports.FIRE = exports.UNUSED_TRASH5 = exports.UNUSED_TRASH4 = exports.UNUSED_TRASH3 = exports.RADTILE = exports.LASTFLOOD = exports.FLOOD = exports.LASTRUBBLE = exports.RUBBLE = exports.WOODS5 = exports.WOODS4 = exports.WOODS3 = exports.WOODS2 = exports.WOODS_HIGH = exports.UNUSED_TRASH2 = exports.UNUSED_TRASH1 = exports.WOODS = exports.LASTTREE = exports.WOODS_LOW = exports.TREEBASE = exports.WATER_HIGH = exports.WATER_LOW = exports.LASTRIVEDGE = exports.FIRSTRIVEDGE = exports.CHANNEL = exports.REDGE = exports.RIVER = exports.DIRT = void 0;
exports.RZB = exports.HHTHR = exports.LHTHR = exports.HOUSE = exports.FREEZ = exports.RESBASE = exports.ROADVPOWERH = exports.LASTRAIL = exports.RAILBASE = exports.VRAILROAD = exports.HRAILROAD = exports.LVRAIL10 = exports.LVRAIL9 = exports.LVRAIL8 = exports.LVRAIL7 = exports.LVRAIL6 = exports.LVRAIL5 = exports.LVRAIL4 = exports.LVRAIL3 = exports.LVRAIL2 = exports.LVRAIL = exports.LHRAIL = exports.VRAIL = exports.HRAIL = exports.UNUSED_TRASH6 = exports.LASTPOWER = exports.POWERBASE = exports.RAILVPOWERH = exports.RAILHPOWERV = exports.LVPOWER10 = exports.LVPOWER9 = exports.LVPOWER8 = exports.LVPOWER7 = exports.LVPOWER6 = exports.LVPOWER5 = exports.LVPOWER4 = exports.LVPOWER3 = exports.LVPOWER2 = exports.LVPOWER = exports.LHPOWER = exports.VPOWER = exports.HPOWER = exports.BRWXXX7 = exports.LASTROAD = exports.BRWXXX6 = exports.BRWXXX5 = exports.BRWXXX4 = exports.HTRFBASE = exports.BRWXXX3 = exports.BRWXXX2 = void 0;
exports.RADAR1 = exports.RADAR0 = exports.HBRDG_END = exports.HBRDG3 = exports.HBRDG2 = exports.HBRDG1 = exports.HBRDG0 = exports.LIGHTNINGBOLT = exports.LASTZONE = exports.NUCLEAR = exports.NUCLEARBASE = exports.FULLSTADIUM = exports.STADIUM = exports.STADIUMBASE = exports.POLICESTATION = exports.POLICESTBASE = exports.FIRESTATION = exports.FIRESTBASE = exports.LASTPOWERPLANT = exports.POWERPLANT = exports.COALBASE = exports.AIRPORT = exports.RADAR = exports.AIRPORTBASE = exports.LASTPORT = exports.PORT = exports.PORTBASE = exports.IND9 = exports.IND8 = exports.IND7 = exports.IND6 = exports.IND5 = exports.IND4 = exports.IND3 = exports.IND2 = exports.IZB = exports.IND1 = exports.LASTIND = exports.INDCLR = exports.INDBASE = exports.COMLAST = exports.CZB = exports.COMCLR = exports.COMBASE = exports.CHURCH0 = exports.CHURCH = exports.CHURCH0BASE = exports.CHURCHBASE = exports.HOSPITAL = exports.HOSPITALBASE = void 0;
exports.TILE_INVALID = exports.TILE_COUNT = exports.CHURCH7LAST = exports.CHURCH7 = exports.CHURCH7BASE = exports.CHURCH6 = exports.CHURCH6BASE = exports.CHURCH5 = exports.CHURCH5BASE = exports.CHURCH4 = exports.CHURCH4BASE = exports.CHURCH3 = exports.CHURCH3BASE = exports.CHURCH2 = exports.CHURCH2BASE = exports.CHURCH1 = exports.CHURCH1BASE = exports.NUKESWIRL4 = exports.NUKESWIRL3 = exports.NUKESWIRL2 = exports.NUKESWIRL1 = exports.VBRDG3 = exports.VBRDG2 = exports.VBRDG1 = exports.VBRDG0 = exports.FOOTBALLGAME2 = exports.FOOTBALLGAME1 = exports.COALSMOKE4 = exports.COALSMOKE3 = exports.COALSMOKE2 = exports.COALSMOKE1 = exports.TINYEXPLAST = exports.LASTTINYEXP = exports.SOMETINYEXP = exports.TINYEXP = exports.SMOKEBASE = exports.TELELAST = exports.TELEBASE = exports.INDBASE2 = exports.FOUNTAIN = exports.RADAR7 = exports.RADAR6 = exports.RADAR5 = exports.RADAR4 = exports.RADAR3 = exports.RADAR2 = void 0;
// TODO Add comment for each tile
exports.DIRT = 0; // Clear tile
// tile 1 ?
/* Water */
exports.RIVER = 2;
exports.REDGE = 3;
exports.CHANNEL = 4;
exports.FIRSTRIVEDGE = 5;
// tile 6 -- 19 ?
exports.LASTRIVEDGE = 20;
exports.WATER_LOW = exports.RIVER; // First water tile
exports.WATER_HIGH = exports.LASTRIVEDGE; // Last water tile (inclusive)
exports.TREEBASE = 21;
exports.WOODS_LOW = exports.TREEBASE;
exports.LASTTREE = 36;
exports.WOODS = 37;
exports.UNUSED_TRASH1 = 38;
exports.UNUSED_TRASH2 = 39;
exports.WOODS_HIGH = exports.UNUSED_TRASH2; // Why is an 'UNUSED' tile used?
exports.WOODS2 = 40;
exports.WOODS3 = 41;
exports.WOODS4 = 42;
exports.WOODS5 = 43;
/* Rubble (4 tiles) */
exports.RUBBLE = 44;
exports.LASTRUBBLE = 47;
exports.FLOOD = 48;
// tile 49, 50 ?
exports.LASTFLOOD = 51;
exports.RADTILE = 52; // Radio-active contaminated tile
exports.UNUSED_TRASH3 = 53;
exports.UNUSED_TRASH4 = 54;
exports.UNUSED_TRASH5 = 55;
/* Fire animation (8 tiles) */
exports.FIRE = 56;
exports.FIREBASE = exports.FIRE;
exports.LASTFIRE = 63;
exports.HBRIDGE = 64; // Horizontal bridge
exports.ROADBASE = exports.HBRIDGE;
exports.VBRIDGE = 65; // Vertical bridge
exports.ROADS = 66;
exports.ROADS2 = 67;
exports.ROADS3 = 68;
exports.ROADS4 = 69;
exports.ROADS5 = 70;
exports.ROADS6 = 71;
exports.ROADS7 = 72;
exports.ROADS8 = 73;
exports.ROADS9 = 74;
exports.ROADS10 = 75;
exports.INTERSECTION = 76;
exports.HROADPOWER = 77;
exports.VROADPOWER = 78;
exports.BRWH = 79;
exports.LTRFBASE = 80; // First tile with low traffic
// tile 81 -- 94 ?
exports.BRWV = 95;
// tile 96 -- 110 ?
exports.BRWXXX1 = 111;
// tile 96 -- 110 ?
exports.BRWXXX2 = 127;
// tile 96 -- 110 ?
exports.BRWXXX3 = 143;
exports.HTRFBASE = 144; // First tile with high traffic
// tile 145 -- 158 ?
exports.BRWXXX4 = 159;
// tile 160 -- 174 ?
exports.BRWXXX5 = 175;
// tile 176 -- 190 ?
exports.BRWXXX6 = 191;
// tile 192 -- 205 ?
exports.LASTROAD = 206;
exports.BRWXXX7 = 207;
/* Power lines */
exports.HPOWER = 208;
exports.VPOWER = 209;
exports.LHPOWER = 210;
exports.LVPOWER = 211;
exports.LVPOWER2 = 212;
exports.LVPOWER3 = 213;
exports.LVPOWER4 = 214;
exports.LVPOWER5 = 215;
exports.LVPOWER6 = 216;
exports.LVPOWER7 = 217;
exports.LVPOWER8 = 218;
exports.LVPOWER9 = 219;
exports.LVPOWER10 = 220;
exports.RAILHPOWERV = 221; // Horizontal rail, vertical power
exports.RAILVPOWERH = 222; // Vertical rail, horizontal power
exports.POWERBASE = exports.HPOWER;
exports.LASTPOWER = exports.RAILVPOWERH;
exports.UNUSED_TRASH6 = 223;
/* Rail */
exports.HRAIL = 224;
exports.VRAIL = 225;
exports.LHRAIL = 226;
exports.LVRAIL = 227;
exports.LVRAIL2 = 228;
exports.LVRAIL3 = 229;
exports.LVRAIL4 = 230;
exports.LVRAIL5 = 231;
exports.LVRAIL6 = 232;
exports.LVRAIL7 = 233;
exports.LVRAIL8 = 234;
exports.LVRAIL9 = 235;
exports.LVRAIL10 = 236;
exports.HRAILROAD = 237;
exports.VRAILROAD = 238;
exports.RAILBASE = exports.HRAIL;
exports.LASTRAIL = 238;
exports.ROADVPOWERH = 239; /* bogus? */
// Residential zone tiles
exports.RESBASE = 240; // Empty residential, tiles 240--248
exports.FREEZ = 244; // center-tile of 3x3 empty residential
exports.HOUSE = 249; // Single tile houses until 260
exports.LHTHR = exports.HOUSE;
exports.HHTHR = 260;
exports.RZB = 265; // center tile first 3x3 tile residential
exports.HOSPITALBASE = 405; // Center of hospital (tiles 405--413)
exports.HOSPITAL = 409; // Center of hospital (tiles 405--413)
exports.CHURCHBASE = 414; // Center of church (tiles 414--422)
exports.CHURCH0BASE = 414; // numbered alias
exports.CHURCH = 418; // Center of church (tiles 414--422)
exports.CHURCH0 = 418; // numbered alias
// Commercial zone tiles
exports.COMBASE = 423; // Empty commercial, tiles 423--431
// tile 424 -- 426 ?
exports.COMCLR = 427;
// tile 428 -- 435 ?
exports.CZB = 436;
// tile 437 -- 608 ?
exports.COMLAST = 609;
// tile 610, 611 ?
// Industrial zone tiles.
exports.INDBASE = 612; // Top-left tile of empty industrial zone.
exports.INDCLR = 616; // Center tile of empty industrial zone.
exports.LASTIND = 620; // Last tile of empty industrial zone.
// Industrial zone population 0, value 0: 621 -- 629
exports.IND1 = 621; // Top-left tile of first non-empty industry zone.
exports.IZB = 625; // Center tile of first non-empty industry zone.
// Industrial zone population 1, value 0: 630 -- 638
// Industrial zone population 2, value 0: 639 -- 647
exports.IND2 = 641;
exports.IND3 = 644;
// Industrial zone population 3, value 0: 648 -- 656
exports.IND4 = 649;
exports.IND5 = 650;
// Industrial zone population 0, value 1: 657 -- 665
// Industrial zone population 1, value 1: 666 -- 674
// Industrial zone population 2, value 1: 675 -- 683
exports.IND6 = 676;
exports.IND7 = 677;
// Industrial zone population 3, value 1: 684 -- 692
exports.IND8 = 686;
exports.IND9 = 689;
// Seaport
exports.PORTBASE = 693; // Top-left tile of the seaport.
exports.PORT = 698; // Center tile of the seaport.
exports.LASTPORT = 708; // Last tile of the seaport.
exports.AIRPORTBASE = 709;
// tile 710 ?
exports.RADAR = 711;
// tile 712 -- 715 ?
exports.AIRPORT = 716;
// tile 717 -- 744 ?
// Coal power plant (4x4).
exports.COALBASE = 745; // First tile of coal power plant.
exports.POWERPLANT = 750; // 'Center' tile of coal power plant.
exports.LASTPOWERPLANT = 760; // Last tile of coal power plant.
// Fire station (3x3).
exports.FIRESTBASE = 761; // First tile of fire station.
exports.FIRESTATION = 765; // 'Center tile' of fire station.
// 769 last tile fire station.
exports.POLICESTBASE = 770;
// tile 771 -- 773 ?
exports.POLICESTATION = 774;
// tile 775 -- 778 ?
// Stadium (4x4).
exports.STADIUMBASE = 779; // First tile stadium.
exports.STADIUM = 784; // 'Center tile' stadium.
// Last tile stadium 794.
// tile 785 -- 799 ?
exports.FULLSTADIUM = 800;
// tile 801 -- 810 ?
// Nuclear power plant (4x4).
exports.NUCLEARBASE = 811; // First tile nuclear power plant.
exports.NUCLEAR = 816; // 'Center' tile nuclear power plant.
exports.LASTZONE = 826; // Also last tile nuclear power plant.
exports.LIGHTNINGBOLT = 827;
exports.HBRDG0 = 828;
exports.HBRDG1 = 829;
exports.HBRDG2 = 830;
exports.HBRDG3 = 831;
exports.HBRDG_END = 832;
exports.RADAR0 = 832;
exports.RADAR1 = 833;
exports.RADAR2 = 834;
exports.RADAR3 = 835;
exports.RADAR4 = 836;
exports.RADAR5 = 837;
exports.RADAR6 = 838;
exports.RADAR7 = 839;
exports.FOUNTAIN = 840;
// tile 841 -- 843: fountain animation.
exports.INDBASE2 = 844;
exports.TELEBASE = 844;
// tile 845 -- 850 ?
exports.TELELAST = 851;
exports.SMOKEBASE = 852;
// tile 853 -- 859 ?
exports.TINYEXP = 860;
// tile 861 -- 863 ?
exports.SOMETINYEXP = 864;
// tile 865 -- 866 ?
exports.LASTTINYEXP = 867;
// tile 868 -- 882 ?
exports.TINYEXPLAST = 883;
// tile 884 -- 915 ?
exports.COALSMOKE1 = 916; // Chimney animation at coal power plant (2, 0).
// 919 last animation tile for chimney at coal power plant (2, 0).
exports.COALSMOKE2 = 920; // Chimney animation at coal power plant (3, 0).
// 923 last animation tile for chimney at coal power plant (3, 0).
exports.COALSMOKE3 = 924; // Chimney animation at coal power plant (2, 1).
// 927 last animation tile for chimney at coal power plant (2, 1).
exports.COALSMOKE4 = 928; // Chimney animation at coal power plant (3, 1).
// 931 last animation tile for chimney at coal power plant (3, 1).
exports.FOOTBALLGAME1 = 932;
// tile 933 -- 939 ?
exports.FOOTBALLGAME2 = 940;
// tile 941 -- 947 ?
exports.VBRDG0 = 948;
exports.VBRDG1 = 949;
exports.VBRDG2 = 950;
exports.VBRDG3 = 951;
exports.NUKESWIRL1 = 952;
exports.NUKESWIRL2 = 953;
exports.NUKESWIRL3 = 954;
exports.NUKESWIRL4 = 955;
// export const  956-959 unused (originally)
// original tile count = 960;
// Extended zones: 956-1019
exports.CHURCH1BASE = 956;
exports.CHURCH1 = 960;
exports.CHURCH2BASE = 965;
exports.CHURCH2 = 969;
exports.CHURCH3BASE = 974;
exports.CHURCH3 = 978;
exports.CHURCH4BASE = 983;
exports.CHURCH4 = 987;
exports.CHURCH5BASE = 992;
exports.CHURCH5 = 996;
exports.CHURCH6BASE = 1001;
exports.CHURCH6 = 1005;
exports.CHURCH7BASE = 1010;
exports.CHURCH7 = 1014;
exports.CHURCH7LAST = 1018;
// tiles 1020-1023 unused
exports.TILE_COUNT = 1024;
exports.TILE_INVALID = -1; // Invalid tile (not used in the world map).


/***/ }),

/***/ 692:
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * jQuery JavaScript Library v3.7.1
 * https://jquery.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2023-08-28T13:37Z
 */
( function( global, factory ) {

	"use strict";

	if (  true && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket trac-14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

		// Support: Chrome <=57, Firefox <=52
		// In some browsers, typeof returns "function" for HTML <object> elements
		// (i.e., `typeof document.createElement( "object" ) === "function"`).
		// We don't want to classify *any* DOM node as a function.
		// Support: QtWeb <=3.8.5, WebKit <=534.34, wkhtmltopdf tool <=0.12.5
		// Plus for old WebKit, typeof returns "function" for HTML collections
		// (e.g., `typeof document.getElementsByTagName("div") === "function"`). (gh-4756)
		return typeof obj === "function" && typeof obj.nodeType !== "number" &&
			typeof obj.item !== "function";
	};


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var version = "3.7.1",

	rhtmlSuffix = /HTML$/i,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},


	// Retrieve the text value of an array of DOM nodes
	text: function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {

			// If no nodeType, this is expected to be an array
			while ( ( node = elem[ i++ ] ) ) {

				// Do not traverse comment nodes
				ret += jQuery.text( node );
			}
		}
		if ( nodeType === 1 || nodeType === 11 ) {
			return elem.textContent;
		}
		if ( nodeType === 9 ) {
			return elem.documentElement.textContent;
		}
		if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}

		// Do not include comment or processing instruction nodes

		return ret;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
						[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	isXMLDoc: function( elem ) {
		var namespace = elem && elem.namespaceURI,
			docElem = elem && ( elem.ownerDocument || elem ).documentElement;

		// Assume HTML when documentElement doesn't yet exist, such as inside
		// document fragments.
		return !rhtmlSuffix.test( namespace || docElem && docElem.nodeName || "HTML" );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( _i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}


function nodeName( elem, name ) {

	return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

}
var pop = arr.pop;


var sort = arr.sort;


var splice = arr.splice;


var whitespace = "[\\x20\\t\\r\\n\\f]";


var rtrimCSS = new RegExp(
	"^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
	"g"
);




// Note: an element does not contain itself
jQuery.contains = function( a, b ) {
	var bup = b && b.parentNode;

	return a === bup || !!( bup && bup.nodeType === 1 && (

		// Support: IE 9 - 11+
		// IE doesn't have `contains` on SVG.
		a.contains ?
			a.contains( bup ) :
			a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
	) );
};




// CSS string/identifier serialization
// https://drafts.csswg.org/cssom/#common-serializing-idioms
var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;

function fcssescape( ch, asCodePoint ) {
	if ( asCodePoint ) {

		// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
		if ( ch === "\0" ) {
			return "\uFFFD";
		}

		// Control characters and (dependent upon position) numbers get escaped as code points
		return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
	}

	// Other potentially-special ASCII characters get backslash-escaped
	return "\\" + ch;
}

jQuery.escapeSelector = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};




var preferredDoc = document,
	pushNative = push;

( function() {

var i,
	Expr,
	outermostContext,
	sortInput,
	hasDuplicate,
	push = pushNative,

	// Local document vars
	document,
	documentElement,
	documentIsHTML,
	rbuggyQSA,
	matches,

	// Instance-specific data
	expando = jQuery.expando,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|" +
		"loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: https://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rleadingCombinator = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" +
		whitespace + "*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		ID: new RegExp( "^#(" + identifier + ")" ),
		CLASS: new RegExp( "^\\.(" + identifier + ")" ),
		TAG: new RegExp( "^(" + identifier + "|[*])" ),
		ATTR: new RegExp( "^" + attributes ),
		PSEUDO: new RegExp( "^" + pseudos ),
		CHILD: new RegExp(
			"^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
				whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
				whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		bool: new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		needsContext: new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// https://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		if ( nonHex ) {

			// Strip the backslash prefix from a non-hex escape sequence
			return nonHex;
		}

		// Replace a hexadecimal escape sequence with the encoded Unicode code point
		// Support: IE <=11+
		// For values outside the Basic Multilingual Plane (BMP), manually construct a
		// surrogate pair
		return high < 0 ?
			String.fromCharCode( high + 0x10000 ) :
			String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes; see `setDocument`.
	// Support: IE 9 - 11+, Edge 12 - 18+
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE/Edge.
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && nodeName( elem, "fieldset" );
		},
		{ dir: "parentNode", next: "legend" }
	);

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android <=4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = {
		apply: function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		},
		call: function( target ) {
			pushNative.apply( target, slice.call( arguments, 1 ) );
		}
	};
}

function find( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE 9 only
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								push.call( results, elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE 9 only
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							find.contains( context, elem ) &&
							elem.id === m ) {

							push.call( results, elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && context.getElementsByClassName ) {
					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( !nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rleadingCombinator.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when
					// strict-comparing two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( newContext != context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = jQuery.escapeSelector( nid );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrimCSS, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties
		// (see https://github.com/jquery/sizzle/issues/157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by jQuery selector module
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		return nodeName( elem, "input" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		return ( nodeName( elem, "input" ) || nodeName( elem, "button" ) ) &&
			elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11+
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					elem.isDisabled !== !disabled &&
						inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a jQuery selector context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [node] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
function setDocument( node ) {
	var subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	documentElement = document.documentElement;
	documentIsHTML = !jQuery.isXMLDoc( document );

	// Support: iOS 7 only, IE 9 - 11+
	// Older browsers didn't support unprefixed `matches`.
	matches = documentElement.matches ||
		documentElement.webkitMatchesSelector ||
		documentElement.msMatchesSelector;

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors
	// (see trac-13936).
	// Limit the fix to IE & Edge Legacy; despite Edge 15+ implementing `matches`,
	// all IE 9+ and Edge Legacy versions implement `msMatchesSelector` as well.
	if ( documentElement.msMatchesSelector &&

		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 9 - 11+, Edge 12 - 18+
		subWindow.addEventListener( "unload", unloadHandler );
	}

	// Support: IE <10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		documentElement.appendChild( el ).id = jQuery.expando;
		return !document.getElementsByName ||
			!document.getElementsByName( jQuery.expando ).length;
	} );

	// Support: IE 9 only
	// Check to see if it's possible to do matchesSelector
	// on a disconnected node.
	support.disconnectedMatch = assert( function( el ) {
		return matches.call( el, "*" );
	} );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// IE/Edge don't support the :scope pseudo-class.
	support.scope = assert( function() {
		return document.querySelectorAll( ":scope" );
	} );

	// Support: Chrome 105 - 111 only, Safari 15.4 - 16.3 only
	// Make sure the `:has()` argument is parsed unforgivingly.
	// We include `*` in the test to detect buggy implementations that are
	// _selectively_ forgiving (specifically when the list includes at least
	// one valid selector).
	// Note that we treat complete lack of support for `:has()` as if it were
	// spec-compliant support, which is fine because use of `:has()` in such
	// environments will fail in the qSA path and fall back to jQuery traversal
	// anyway.
	support.cssHas = assert( function() {
		try {
			document.querySelector( ":has(*,:jqfake)" );
			return false;
		} catch ( e ) {
			return true;
		}
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter.ID = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find.ID = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter.ID =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find.ID = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find.TAG = function( tag, context ) {
		if ( typeof context.getElementsByTagName !== "undefined" ) {
			return context.getElementsByTagName( tag );

		// DocumentFragment nodes don't have gEBTN
		} else {
			return context.querySelectorAll( tag );
		}
	};

	// Class
	Expr.find.CLASS = function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	rbuggyQSA = [];

	// Build QSA regex
	// Regex strategy adopted from Diego Perini
	assert( function( el ) {

		var input;

		documentElement.appendChild( el ).innerHTML =
			"<a id='" + expando + "' href='' disabled='disabled'></a>" +
			"<select id='" + expando + "-\r\\' disabled='disabled'>" +
			"<option selected=''></option></select>";

		// Support: iOS <=7 - 8 only
		// Boolean attributes and "value" are not treated correctly in some XML documents
		if ( !el.querySelectorAll( "[selected]" ).length ) {
			rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
		}

		// Support: iOS <=7 - 8 only
		if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
			rbuggyQSA.push( "~=" );
		}

		// Support: iOS 8 only
		// https://bugs.webkit.org/show_bug.cgi?id=136851
		// In-page `selector#id sibling-combinator selector` fails
		if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
			rbuggyQSA.push( ".#.+[+~]" );
		}

		// Support: Chrome <=105+, Firefox <=104+, Safari <=15.4+
		// In some of the document kinds, these selectors wouldn't work natively.
		// This is probably OK but for backwards compatibility we want to maintain
		// handling them through jQuery traversal in jQuery 3.x.
		if ( !el.querySelectorAll( ":checked" ).length ) {
			rbuggyQSA.push( ":checked" );
		}

		// Support: Windows 8 Native Apps
		// The type and name attributes are restricted during .innerHTML assignment
		input = document.createElement( "input" );
		input.setAttribute( "type", "hidden" );
		el.appendChild( input ).setAttribute( "name", "D" );

		// Support: IE 9 - 11+
		// IE's :disabled selector does not pick up the children of disabled fieldsets
		// Support: Chrome <=105+, Firefox <=104+, Safari <=15.4+
		// In some of the document kinds, these selectors wouldn't work natively.
		// This is probably OK but for backwards compatibility we want to maintain
		// handling them through jQuery traversal in jQuery 3.x.
		documentElement.appendChild( el ).disabled = true;
		if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
			rbuggyQSA.push( ":enabled", ":disabled" );
		}

		// Support: IE 11+, Edge 15 - 18+
		// IE 11/Edge don't find elements on a `[name='']` query in some cases.
		// Adding a temporary attribute to the document before the selection works
		// around the issue.
		// Interestingly, IE 10 & older don't seem to have the issue.
		input = document.createElement( "input" );
		input.setAttribute( "name", "" );
		el.appendChild( input );
		if ( !el.querySelectorAll( "[name='']" ).length ) {
			rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
				whitespace + "*(?:''|\"\")" );
		}
	} );

	if ( !support.cssHas ) {

		// Support: Chrome 105 - 110+, Safari 15.4 - 16.3+
		// Our regular `try-catch` mechanism fails to detect natively-unsupported
		// pseudo-classes inside `:has()` (such as `:has(:contains("Foo"))`)
		// in browsers that parse the `:has()` argument as a forgiving selector list.
		// https://drafts.csswg.org/selectors/#relational now requires the argument
		// to be parsed unforgivingly, but browsers have not yet fully adjusted.
		rbuggyQSA.push( ":has" );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a === document || a.ownerDocument == preferredDoc &&
				find.contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b === document || b.ownerDocument == preferredDoc &&
				find.contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	};

	return document;
}

find.matches = function( expr, elements ) {
	return find( expr, null, null, elements );
};

find.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyQSA || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return find( expr, document, null, [ elem ] ).length > 0;
};

find.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return jQuery.contains( context, elem );
};


find.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (see trac-13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	if ( val !== undefined ) {
		return val;
	}

	return elem.getAttribute( name );
};

find.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
jQuery.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	//
	// Support: Android <=4.0+
	// Testing for detecting duplicates is unpredictable so instead assume we can't
	// depend on duplicate detection in all browsers without a stable sort.
	hasDuplicate = !support.sortStable;
	sortInput = !support.sortStable && slice.call( results, 0 );
	sort.call( results, sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			splice.call( results, duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

jQuery.fn.uniqueSort = function() {
	return this.pushStack( jQuery.uniqueSort( slice.apply( this ) ) );
};

Expr = jQuery.expr = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		ATTR: function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] || match[ 5 ] || "" )
				.replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		CHILD: function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					find.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" )
				);
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

			// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				find.error( match[ 0 ] );
			}

			return match;
		},

		PSEUDO: function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr.CHILD.test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		TAG: function( nodeNameSelector ) {
			var expectedNodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return nodeName( elem, expectedNodeName );
				};
		},

		CLASS: function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace + ")" + className +
					"(" + whitespace + "|$)" ) ) &&
				classCache( className, function( elem ) {
					return pattern.test(
						typeof elem.className === "string" && elem.className ||
							typeof elem.getAttribute !== "undefined" &&
								elem.getAttribute( "class" ) ||
							""
					);
				} );
		},

		ATTR: function( name, operator, check ) {
			return function( elem ) {
				var result = find.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				if ( operator === "=" ) {
					return result === check;
				}
				if ( operator === "!=" ) {
					return result !== check;
				}
				if ( operator === "^=" ) {
					return check && result.indexOf( check ) === 0;
				}
				if ( operator === "*=" ) {
					return check && result.indexOf( check ) > -1;
				}
				if ( operator === "$=" ) {
					return check && result.slice( -check.length ) === check;
				}
				if ( operator === "~=" ) {
					return ( " " + result.replace( rwhitespace, " " ) + " " )
						.indexOf( check ) > -1;
				}
				if ( operator === "|=" ) {
					return result === check || result.slice( 0, check.length + 1 ) === check + "-";
				}

				return false;
			};
		},

		CHILD: function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										nodeName( node, name ) :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || ( parent[ expando ] = {} );
							cache = outerCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {
								outerCache = elem[ expando ] || ( elem[ expando ] = {} );
								cache = outerCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										nodeName( node, name ) :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );
											outerCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		PSEUDO: function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// https://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					find.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as jQuery does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		not: markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrimCSS, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element
					// (see https://github.com/jquery/sizzle/issues/299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		has: markFunction( function( selector ) {
			return function( elem ) {
				return find( selector, elem ).length > 0;
			};
		} ),

		contains: markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || jQuery.text( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// https://www.w3.org/TR/selectors/#lang-pseudo
		lang: markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				find.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		target: function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		root: function( elem ) {
			return elem === documentElement;
		},

		focus: function( elem ) {
			return elem === safeActiveElement() &&
				document.hasFocus() &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		enabled: createDisabledPseudo( false ),
		disabled: createDisabledPseudo( true ),

		checked: function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// https://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			return ( nodeName( elem, "input" ) && !!elem.checked ) ||
				( nodeName( elem, "option" ) && !!elem.selected );
		},

		selected: function( elem ) {

			// Support: IE <=11+
			// Accessing the selectedIndex property
			// forces the browser to treat the default option as
			// selected when in an optgroup.
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		empty: function( elem ) {

			// https://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		parent: function( elem ) {
			return !Expr.pseudos.empty( elem );
		},

		// Element/input types
		header: function( elem ) {
			return rheader.test( elem.nodeName );
		},

		input: function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		button: function( elem ) {
			return nodeName( elem, "input" ) && elem.type === "button" ||
				nodeName( elem, "button" );
		},

		text: function( elem ) {
			var attr;
			return nodeName( elem, "input" ) && elem.type === "text" &&

				// Support: IE <10 only
				// New HTML5 attribute values (e.g., "search") appear
				// with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		first: createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		last: createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		eq: createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		even: createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		odd: createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		lt: createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i;

			if ( argument < 0 ) {
				i = argument + length;
			} else if ( argument > length ) {
				i = length;
			} else {
				i = argument;
			}

			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		gt: createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos.nth = Expr.pseudos.eq;

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rleadingCombinator.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrimCSS, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	if ( parseOnly ) {
		return soFar.length;
	}

	return soFar ?
		find.error( selector ) :

		// Cache the tokens
		tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						if ( skip && nodeName( elem, skip ) ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = outerCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							outerCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		find( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem, matcherOut,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed ||
				multipleContexts( selector || "*",
					context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems;

		if ( matcher ) {

			// If we have a postFinder, or filtered seed, or non-seed postFilter
			// or preexisting results,
			matcherOut = postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

				// ...intermediate processing is necessary
				[] :

				// ...otherwise use results directly
				results;

			// Find primary matches
			matcher( matcherIn, matcherOut, context, xml );
		} else {
			matcherOut = matcherIn;
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf.call( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			var ret = ( !leadingRelative && ( xml || context != outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element
			// (see https://github.com/jquery/sizzle/issues/299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 )
							.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrimCSS, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find.TAG( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: iOS <=7 - 9 only
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching
			// elements by id. (see trac-14142)
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							push.call( results, elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					jQuery.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

function compile( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
}

/**
 * A low-level selection function that works with jQuery's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with jQuery selector compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find.ID(
				token.matches[ 0 ].replace( runescape, funescape ),
				context
			) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr.needsContext.test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) &&
						testContext( context.parentNode ) || context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
}

// One-time assignments

// Support: Android <=4.0 - 4.1+
// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Initialize against the default document
setDocument();

// Support: Android <=4.0 - 4.1+
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

jQuery.find = find;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.unique = jQuery.uniqueSort;

// These have always been private, but they used to be documented as part of
// Sizzle so let's maintain them for now for backwards compatibility purposes.
find.compile = compile;
find.select = select;
find.setDocument = setDocument;
find.tokenize = tokenize;

find.escape = jQuery.escapeSelector;
find.getText = jQuery.text;
find.isXML = jQuery.isXMLDoc;
find.selectors = jQuery.expr;
find.support = jQuery.support;
find.uniqueSort = jQuery.uniqueSort;

	/* eslint-enable */

} )();


var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (trac-9521)
	// Strict HTML recognition (trac-11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to jQuery#find
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.error );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the error, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getErrorHook ) {
									process.error = jQuery.Deferred.getErrorHook();

								// The deprecated alias of the above. While the name suggests
								// returning the stack, not an error instance, jQuery just passes
								// it directly to `console.warn` so both will work; an instance
								// just better cooperates with source maps.
								} else if ( jQuery.Deferred.getStackHook ) {
									process.error = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the primary Deferred
			primary = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						primary.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, primary.done( updateFunc( i ) ).resolve, primary.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( primary.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return primary.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), primary.reject );
		}

		return primary.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

// If `jQuery.Deferred.getErrorHook` is defined, `asyncError` is an error
// captured before the async barrier to get the original error cause
// which may otherwise be hidden.
jQuery.Deferred.exceptionHook = function( error, asyncError ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message,
			error.stack, asyncError );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See trac-6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (trac-9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see trac-8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (trac-14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (trac-11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (trac-14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (trac-13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (trac-15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (trac-12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
				dataPriv.get( this, "events" ) || Object.create( null )
			)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (trac-13208)
				// Don't process clicks on disabled elements (trac-6911, trac-8165, trac-11382, trac-11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (trac-13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
						return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
						return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", true );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, isSetup ) {

	// Missing `isSetup` indicates a trigger call, which must force setup through jQuery.event.add
	if ( !isSetup ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				if ( !saved ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					this[ type ]();
					result = dataPriv.get( this, type );
					dataPriv.set( this, type, false );

					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();

						return result;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering
				// the native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved ) {

				// ...and capture the result
				dataPriv.set( this, type, jQuery.event.trigger(
					saved[ 0 ],
					saved.slice( 1 ),
					this
				) );

				// Abort handling of the native event by all jQuery handlers while allowing
				// native handlers on the same element to run. On target, this is achieved
				// by stopping immediate propagation just on the jQuery event. However,
				// the native event is re-wrapped by a jQuery one on each level of the
				// propagation so the only way to stop it for jQuery is to stop it for
				// everyone via native `stopPropagation()`. This is not a problem for
				// focus/blur which don't bubble, but it does also stop click on checkboxes
				// and radios. We accept this limitation.
				event.stopPropagation();
				event.isImmediatePropagationStopped = returnTrue;
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (trac-504, trac-13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,
	which: true
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {

	function focusMappedHandler( nativeEvent ) {
		if ( document.documentMode ) {

			// Support: IE 11+
			// Attach a single focusin/focusout handler on the document while someone wants
			// focus/blur. This is because the former are synchronous in IE while the latter
			// are async. In other browsers, all those handlers are invoked synchronously.

			// `handle` from private data would already wrap the event, but we need
			// to change the `type` here.
			var handle = dataPriv.get( this, "handle" ),
				event = jQuery.event.fix( nativeEvent );
			event.type = nativeEvent.type === "focusin" ? "focus" : "blur";
			event.isSimulated = true;

			// First, handle focusin/focusout
			handle( nativeEvent );

			// ...then, handle focus/blur
			//
			// focus/blur don't bubble while focusin/focusout do; simulate the former by only
			// invoking the handler at the lower level.
			if ( event.target === event.currentTarget ) {

				// The setup part calls `leverageNative`, which, in turn, calls
				// `jQuery.event.add`, so event handle will already have been set
				// by this point.
				handle( event );
			}
		} else {

			// For non-IE browsers, attach a single capturing handler on the document
			// while someone wants focusin/focusout.
			jQuery.event.simulate( delegateType, nativeEvent.target,
				jQuery.event.fix( nativeEvent ) );
		}
	}

	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			var attaches;

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, true );

			if ( document.documentMode ) {

				// Support: IE 9 - 11+
				// We use the same native handler for focusin & focus (and focusout & blur)
				// so we need to coordinate setup & teardown parts between those events.
				// Use `delegateType` as the key as `type` is already used by `leverageNative`.
				attaches = dataPriv.get( this, delegateType );
				if ( !attaches ) {
					this.addEventListener( delegateType, focusMappedHandler );
				}
				dataPriv.set( this, delegateType, ( attaches || 0 ) + 1 );
			} else {

				// Return false to allow normal processing in the caller
				return false;
			}
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		teardown: function() {
			var attaches;

			if ( document.documentMode ) {
				attaches = dataPriv.get( this, delegateType ) - 1;
				if ( !attaches ) {
					this.removeEventListener( delegateType, focusMappedHandler );
					dataPriv.remove( this, delegateType );
				} else {
					dataPriv.set( this, delegateType, attaches );
				}
			} else {

				// Return false to indicate standard teardown should be applied
				return false;
			}
		},

		// Suppress native focus or blur if we're currently inside
		// a leveraged native-event stack
		_default: function( event ) {
			return dataPriv.get( event.target, type );
		},

		delegateType: delegateType
	};

	// Support: Firefox <=44
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
	//
	// Support: IE 9 - 11+
	// To preserve relative focusin/focus & focusout/blur event order guaranteed on the 3.x branch,
	// attach a single handler for both events in IE.
	jQuery.event.special[ delegateType ] = {
		setup: function() {

			// Handle: regular nodes (via `this.ownerDocument`), window
			// (via `this.document`) & document (via `this`).
			var doc = this.ownerDocument || this.document || this,
				dataHolder = document.documentMode ? this : doc,
				attaches = dataPriv.get( dataHolder, delegateType );

			// Support: IE 9 - 11+
			// We use the same native handler for focusin & focus (and focusout & blur)
			// so we need to coordinate setup & teardown parts between those events.
			// Use `delegateType` as the key as `type` is already used by `leverageNative`.
			if ( !attaches ) {
				if ( document.documentMode ) {
					this.addEventListener( delegateType, focusMappedHandler );
				} else {
					doc.addEventListener( type, focusMappedHandler, true );
				}
			}
			dataPriv.set( dataHolder, delegateType, ( attaches || 0 ) + 1 );
		},
		teardown: function() {
			var doc = this.ownerDocument || this.document || this,
				dataHolder = document.documentMode ? this : doc,
				attaches = dataPriv.get( dataHolder, delegateType ) - 1;

			if ( !attaches ) {
				if ( document.documentMode ) {
					this.removeEventListener( delegateType, focusMappedHandler );
				} else {
					doc.removeEventListener( type, focusMappedHandler, true );
				}
				dataPriv.remove( dataHolder, delegateType );
			} else {
				dataPriv.set( dataHolder, delegateType, attaches );
			}
		}
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,

	rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (trac-8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Re-enable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {

							// Unwrap a CDATA section containing script contents. This shouldn't be
							// needed as in XML documents they're already not visible when
							// inspecting element contents and in HTML documents they have no
							// meaning but we're preserving that logic for backwards compatibility.
							// This will be removed completely in 4.0. See gh-4904.
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew jQuery#find here for performance reasons:
			// https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var rcustomProp = /^--/;


var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (trac-15098, trac-14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (trac-8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		//
		// Support: Firefox 70+
		// Only Firefox includes border widths
		// in computed dimensions. (gh-4529)
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
				tr.style.cssText = "box-sizing:content-box;border:1px solid";

				// Support: Chrome 86+
				// Height set through cssText does not get applied.
				// Computed height then comes back as 0.
				tr.style.height = "1px";
				trChild.style.height = "9px";

				// Support: Android 8 Chrome 86+
				// In our bodyBackground.html iframe,
				// display for all div elements is set to "inline",
				// which causes a problem only in Android 8 Chrome 86.
				// Ensuring the div is `display: block`
				// gets around this issue.
				trChild.style.display = "block";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
					parseInt( trStyle.borderTopWidth, 10 ) +
					parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		isCustomProp = rcustomProp.test( name ),

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, trac-12537)
	//   .css('--customProperty) (gh-3144)
	if ( computed ) {

		// Support: IE <=9 - 11+
		// IE only supports `"float"` in `getPropertyValue`; in computed styles
		// it's only available as `"cssFloat"`. We no longer modify properties
		// sent to `.css()` apart from camelCasing, so we need to check both.
		// Normally, this would create difference in behavior: if
		// `getPropertyValue` returns an empty string, the value returned
		// by `.css()` would be `undefined`. This is usually the case for
		// disconnected elements. However, in IE even disconnected elements
		// with no styles return `"none"` for `getPropertyValue( "float" )`
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( isCustomProp && ret ) {

			// Support: Firefox 105+, Chrome <=105+
			// Spec requires trimming whitespace for custom properties (gh-4926).
			// Firefox only trims leading whitespace. Chrome just collapses
			// both leading & trailing whitespace to a single space.
			//
			// Fall back to `undefined` if empty string returned.
			// This collapses a missing definition with property defined
			// and set to an empty string but there's no standard API
			// allowing us to differentiate them without a performance penalty
			// and returning `undefined` aligns with older jQuery.
			//
			// rtrimCSS treats U+000D CARRIAGE RETURN and U+000C FORM FEED
			// as whitespace while CSS does not, but this is not a problem
			// because CSS preprocessing replaces them with U+000A LINE FEED
			// (which *is* CSS whitespace)
			// https://www.w3.org/TR/css-syntax-3/#input-preprocessing
			ret = ret.replace( rtrimCSS, "$1" ) || undefined;
		}

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0,
		marginDelta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		// Count margin delta separately to only add it after scroll gutter adjustment.
		// This is needed to make negative margins work with `outerHeight( true )` (gh-3982).
		if ( box === "margin" ) {
			marginDelta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta + marginDelta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		animationIterationCount: true,
		aspectRatio: true,
		borderImageSlice: true,
		columnCount: true,
		flexGrow: true,
		flexShrink: true,
		fontWeight: true,
		gridArea: true,
		gridColumn: true,
		gridColumnEnd: true,
		gridColumnStart: true,
		gridRow: true,
		gridRowEnd: true,
		gridRowStart: true,
		lineHeight: true,
		opacity: true,
		order: true,
		orphans: true,
		scale: true,
		widows: true,
		zIndex: true,
		zoom: true,

		// SVG-related
		fillOpacity: true,
		floodOpacity: true,
		stopOpacity: true,
		strokeMiterlimit: true,
		strokeOpacity: true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (trac-7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug trac-9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (trac-7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
					swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, dimension, extra );
					} ) :
					getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
				jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

				/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (trac-12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
					animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};

		doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// Use proper attribute retrieval (trac-12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classNames, cur, curValue, className, i, finalValue;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {
				curValue = getClass( this );
				cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classNames.length; i++ ) {
						className = classNames[ i ];
						if ( cur.indexOf( " " + className + " " ) < 0 ) {
							cur += className + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						this.setAttribute( "class", finalValue );
					}
				}
			} );
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, cur, curValue, className, i, finalValue;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {
				curValue = getClass( this );

				// This expression is here for better compressibility (see addClass)
				cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classNames.length; i++ ) {
						className = classNames[ i ];

						// Remove *all* instances
						while ( cur.indexOf( " " + className + " " ) > -1 ) {
							cur = cur.replace( " " + className + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						this.setAttribute( "class", finalValue );
					}
				}
			} );
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var classNames, className, i, self,
			type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		classNames = classesToArray( value );

		return this.each( function() {
			if ( isValidValue ) {

				// Toggle individual class names
				self = jQuery( this );

				for ( i = 0; i < classNames.length; i++ ) {
					className = classNames[ i ];

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (trac-14686, trac-14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (trac-2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, parserErrorElem;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {}

	parserErrorElem = xml && xml.getElementsByTagName( "parsererror" )[ 0 ];
	if ( !xml || parserErrorElem ) {
		jQuery.error( "Invalid XML: " + (
			parserErrorElem ?
				jQuery.map( parserErrorElem.childNodes, function( el ) {
					return el.textContent;
				} ).join( "\n" ) :
				data
		) );
	}
	return xml;
};


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (trac-9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (trac-9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || Object.create( null ) )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (trac-6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} ).filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} ).map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// trac-7653, trac-8125, trac-8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (trac-10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );

originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes trac-9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (trac-10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket trac-12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (trac-15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// trac-9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script but not if jsonp
			if ( !isSuccess &&
				jQuery.inArray( "script", s.dataTypes ) > -1 &&
				jQuery.inArray( "json", s.dataTypes ) < 0 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (trac-11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// trac-1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see trac-8605, trac-14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// trac-14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( {
		padding: "inner" + name,
		content: type,
		"": "outer" + name
	}, function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this
			.on( "mouseenter", fnOver )
			.on( "mouseleave", fnOut || fnOver );
	}
} );

jQuery.each(
	( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	}
);




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
// Require that the "whitespace run" starts from a non-whitespace
// to avoid O(N^2) behavior when the engine would try matching "\s+$" at each space position.
var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "$1" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( true ) {
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
		return jQuery;
	}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (trac-7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (trac-13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );


/***/ }),

/***/ 737:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Random = void 0;
function getChance(chance, rng) {
    if (rng === void 0) { rng = getRandom16; }
    // tslint:disable-next-line:no-bitwise
    return (rng() & chance) === 0;
}
function getERandom(max, rng) {
    if (rng === void 0) { rng = getRandom; }
    var firstCandidate = rng(max);
    var secondCandidate = rng(max);
    return Math.min(firstCandidate, secondCandidate);
}
function getRandom(max, mathGlobal) {
    if (mathGlobal === void 0) { mathGlobal = Math; }
    return mathGlobal.floor(mathGlobal.random() * (max + 1));
}
function getRandom16(rng) {
    if (rng === void 0) { rng = getRandom; }
    return rng(65535);
}
function getRandom16Signed(rng) {
    if (rng === void 0) { rng = getRandom16; }
    var value = rng();
    if (value < 32768) {
        return value;
    }
    else {
        return -(Math.pow(2, 16)) + value;
    }
}
var Random = {
    getChance: getChance,
    getERandom: getERandom,
    getRandom: getRandom,
    getRandom16: getRandom16,
    getRandom16Signed: getRandom16Signed,
};
exports.Random = Random;


/***/ }),

/***/ 851:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BIT_MASK = exports.BIT_END = exports.BIT_START = exports.ALLBITS = exports.ASCBIT = exports.BNCNBIT = exports.BLBNCNBIT = exports.BLBNBIT = exports.ZONEBIT = exports.ANIMBIT = exports.BULLBIT = exports.BURNBIT = exports.CONDBIT = exports.POWERBIT = exports.NOFLAGS = void 0;
// Bit-masks for statusBits
exports.NOFLAGS = 0x0000;
exports.POWERBIT = 0x8000; // bit 15, tile has power.
exports.CONDBIT = 0x4000; // bit 14. tile can conduct electricity.
exports.BURNBIT = 0x2000; // bit 13, tile can be lit.
exports.BULLBIT = 0x1000; // bit 12, tile is bulldozable.
exports.ANIMBIT = 0x0800; // bit 11, tile is animated.
exports.ZONEBIT = 0x0400; // bit 10, tile is the center tile of the zone.
exports.BLBNBIT = exports.BULLBIT | exports.BURNBIT;
exports.BLBNCNBIT = exports.BULLBIT | exports.BURNBIT | exports.CONDBIT;
exports.BNCNBIT = exports.BURNBIT | exports.CONDBIT;
exports.ASCBIT = exports.ANIMBIT | exports.CONDBIT | exports.BURNBIT;
exports.ALLBITS = exports.POWERBIT | exports.CONDBIT | exports.BURNBIT | exports.BULLBIT | exports.ANIMBIT | exports.ZONEBIT;
exports.BIT_START = 0x400;
exports.BIT_END = 0x8000;
exports.BIT_MASK = exports.BIT_START - 1;


/***/ }),

/***/ 910:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.REACHED_CITY = exports.REACHED_CAPITAL = exports.QUERY_WINDOW_NEEDED = exports.QUERY_WINDOW_CLOSED = exports.POPULATION_UPDATED = exports.POLICE_NEEDS_FUNDING = exports.PLANE_CRASHED = exports.NUCLEAR_MELTDOWN = exports.NOT_ENOUGH_POWER = exports.NO_MONEY = exports.NEED_STADIUM = exports.NEED_SEAPORT = exports.NEED_POLICE_STATION = exports.NEED_MORE_ROADS = exports.NEED_MORE_RESIDENTIAL = exports.NEED_MORE_RAILS = exports.NEED_MORE_INDUSTRIAL = exports.NEED_MORE_COMMERCIAL = exports.NEED_FIRE_STATION = exports.NEED_ELECTRICITY = exports.NEED_AIRPORT = exports.NAG_WINDOW_CLOSED = exports.MONSTER_SIGHTED = exports.HIGH_POLLUTION = exports.HIGH_CRIME = exports.HELICOPTER_CRASHED = exports.HEAVY_TRAFFIC = exports.FUNDS_CHANGED = exports.FRONT_END_MESSAGE = exports.FLOODING_REPORTED = exports.FIRE_STATION_NEEDS_FUNDING = exports.FIRE_REPORTED = exports.EXPLOSION_REPORTED = exports.EVAL_WINDOW_CLOSED = exports.EVAL_UPDATED = exports.EVAL_REQUESTED = exports.EARTHQUAKE = exports.DISASTER_WINDOW_CLOSED = exports.DISASTER_REQUESTED = exports.DEBUG_WINDOW_CLOSED = exports.DEBUG_WINDOW_REQUESTED = exports.DATE_UPDATED = exports.CONGRATS_WINDOW_CLOSED = exports.CONGRATS_SHOWING = exports.CLASSIFICATION_UPDATED = exports.BLACKOUTS_REPORTED = exports.BUDGET_WINDOW_CLOSED = exports.BUDGET_REQUESTED = exports.BUDGET_NEEDED = exports.AUTOBUDGET_CHANGED = void 0;
exports.CRASHES = exports.DISASTER_MESSAGES = exports.WELCOME = exports.VALVES_UPDATED = exports.TRAIN_CRASHED = exports.TRAFFIC_JAMS = exports.TOUCH_WINDOW_CLOSED = exports.TORNADO_SIGHTED = exports.TOOL_CLICKED = exports.TAX_TOO_HIGH = exports.SPRITE_MOVED = exports.SPRITE_DYING = exports.SPEED_CHANGE = exports.SOUND_MONSTER = exports.SOUND_HONKHONK = exports.SOUND_HEAVY_TRAFFIC = exports.SOUND_EXPLOSIONLOW = exports.SOUND_EXPLOSIONHIGH = exports.SHIP_CRASHED = exports.SETTINGS_WINDOW_REQUESTED = exports.SETTINGS_WINDOW_CLOSED = exports.SCREENSHOT_WINDOW_REQUESTED = exports.SCREENSHOT_WINDOW_CLOSED = exports.SCREENSHOT_LINK_CLOSED = exports.SCORE_UPDATED = exports.SAVE_WINDOW_CLOSED = exports.SAVE_REQUESTED = exports.ROAD_NEEDS_FUNDING = exports.REACHED_VILLAGE = exports.REACHED_TOWN = exports.REACHED_MEGALOPOLIS = exports.REACHED_METROPOLIS = void 0;
exports.AUTOBUDGET_CHANGED = "Autobudget changed";
exports.BUDGET_NEEDED = "User needs to budget";
exports.BUDGET_REQUESTED = "Budget window requested";
exports.BUDGET_WINDOW_CLOSED = "Budget window closed";
exports.BLACKOUTS_REPORTED = "Blackouts reported";
exports.CLASSIFICATION_UPDATED = "Classification updated";
exports.CONGRATS_SHOWING = "Congratulations showing";
exports.CONGRATS_WINDOW_CLOSED = "Congratulations window closed";
exports.DATE_UPDATED = "Date changed";
exports.DEBUG_WINDOW_REQUESTED = "Debug Window Requested";
exports.DEBUG_WINDOW_CLOSED = "Debug Window Closed";
exports.DISASTER_REQUESTED = "Disaster Requested";
exports.DISASTER_WINDOW_CLOSED = "Disaster window closed";
exports.EARTHQUAKE = "Earthquake";
exports.EVAL_REQUESTED = "Evaluation Requested";
exports.EVAL_UPDATED = "Evaluation Updated";
exports.EVAL_WINDOW_CLOSED = "Eval window closed";
exports.EXPLOSION_REPORTED = "Explosion Reported";
exports.FIRE_REPORTED = "Fire!";
exports.FIRE_STATION_NEEDS_FUNDING = "Fire station needs funding";
exports.FLOODING_REPORTED = "Flooding reported";
exports.FRONT_END_MESSAGE = "Front-end Message";
exports.FUNDS_CHANGED = "Total funds has changed";
exports.HEAVY_TRAFFIC = "Total funds has changed";
exports.HELICOPTER_CRASHED = "Helicopter crashed";
exports.HIGH_CRIME = "High crime";
exports.HIGH_POLLUTION = "High pollution";
exports.MONSTER_SIGHTED = "Monster sighted";
exports.NAG_WINDOW_CLOSED = "Nag window closed";
exports.NEED_AIRPORT = "Airport needed";
exports.NEED_ELECTRICITY = "More power needed";
exports.NEED_FIRE_STATION = "Fire station needed";
exports.NEED_MORE_COMMERCIAL = "More commercial zones needed";
exports.NEED_MORE_INDUSTRIAL = "More industrial zones needed";
exports.NEED_MORE_RAILS = "More railways needed";
exports.NEED_MORE_RESIDENTIAL = "More residential needed";
exports.NEED_MORE_ROADS = "More roads needed";
exports.NEED_POLICE_STATION = "Police station needed";
exports.NEED_SEAPORT = "Seaport needed";
exports.NEED_STADIUM = "Stadium needed";
exports.NO_MONEY = "No money";
exports.NOT_ENOUGH_POWER = "Not enough power";
exports.NUCLEAR_MELTDOWN = "Nuclear Meltdown";
exports.PLANE_CRASHED = "Plane crashed";
exports.POLICE_NEEDS_FUNDING = "Police need funding";
exports.POPULATION_UPDATED = "Population updated";
exports.QUERY_WINDOW_CLOSED = "Query window closed";
exports.QUERY_WINDOW_NEEDED = "Query window needed";
exports.REACHED_CAPITAL = "Now a capital";
exports.REACHED_CITY = "Now a city";
exports.REACHED_METROPOLIS = "Now a metropolis";
exports.REACHED_MEGALOPOLIS = "Now a megalopolis";
exports.REACHED_TOWN = "Now a town";
exports.REACHED_VILLAGE = "Now a village";
exports.ROAD_NEEDS_FUNDING = "Roads need funding";
exports.SAVE_REQUESTED = "Save requested";
exports.SAVE_WINDOW_CLOSED = "Save window closed";
exports.SCORE_UPDATED = "Scoe updated";
exports.SCREENSHOT_LINK_CLOSED = "Screenshot link closed";
exports.SCREENSHOT_WINDOW_CLOSED = "Screenshot window closed";
exports.SCREENSHOT_WINDOW_REQUESTED = "Screenshot window requested";
exports.SETTINGS_WINDOW_CLOSED = "Settings window closed";
exports.SETTINGS_WINDOW_REQUESTED = "Settings window requested";
exports.SHIP_CRASHED = "Shipwrecked";
exports.SOUND_EXPLOSIONHIGH = "Explosion! Bang!";
exports.SOUND_EXPLOSIONLOW = "Explosion! Bang!";
exports.SOUND_HEAVY_TRAFFIC = "Heavy Traffic sound";
exports.SOUND_HONKHONK = "HonkHonk sound";
exports.SOUND_MONSTER = "Monster sound";
exports.SPEED_CHANGE = "Speed change";
exports.SPRITE_DYING = "Sprite dying";
exports.SPRITE_MOVED = "Sprite move";
exports.TAX_TOO_HIGH = "Tax too high";
exports.TOOL_CLICKED = "Tool clicked";
exports.TORNADO_SIGHTED = "Tornado sighted";
exports.TOUCH_WINDOW_CLOSED = "Touch Window closed";
exports.TRAFFIC_JAMS = "Traffic jams reported";
exports.TRAIN_CRASHED = "Train crashed";
exports.VALVES_UPDATED = "Valves updated";
exports.WELCOME = "Welcome to micropolisJS";
exports.DISASTER_MESSAGES = [
    exports.EARTHQUAKE,
    exports.EXPLOSION_REPORTED,
    exports.FIRE_REPORTED,
    exports.FLOODING_REPORTED,
    exports.MONSTER_SIGHTED,
    exports.NUCLEAR_MELTDOWN,
    exports.TORNADO_SIGHTED,
];
exports.CRASHES = [
    exports.HELICOPTER_CRASHED,
    exports.PLANE_CRASHED,
    exports.SHIP_CRASHED,
    exports.TRAIN_CRASHED,
];


/***/ }),

/***/ 952:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;

/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */
__webpack_unused_export__ = ({ value: true });
exports.J = void 0;
exports.J = 'data:image/png;base64,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';


/***/ }),

/***/ 958:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;

/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */
__webpack_unused_export__ = ({ value: true });
exports.Ev = exports.OR = exports.bn = exports.HK = exports.LQ = exports.MT = exports.XT = void 0;
exports.XT = 1;
exports.MT = 2;
exports.LQ = 3;
exports.HK = 4;
exports.bn = 5;
exports.OR = 6;
exports.Ev = 7;


/***/ }),

/***/ 973:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Position = void 0;
var Direction = __importStar(__webpack_require__(441));
var DirectionDelta = /** @class */ (function () {
    function DirectionDelta(xDelta, yDelta) {
        this.xDelta = xDelta;
        this.yDelta = yDelta;
    }
    return DirectionDelta;
}());
function getDeltaFor(direction) {
    switch (direction) {
        case Direction.NORTH:
            return new DirectionDelta(0, -1);
        case Direction.NORTHEAST:
            return new DirectionDelta(1, -1);
        case Direction.EAST:
            return new DirectionDelta(1, 0);
        case Direction.SOUTHEAST:
            return new DirectionDelta(1, 1);
        case Direction.SOUTH:
            return new DirectionDelta(0, 1);
        case Direction.SOUTHWEST:
            return new DirectionDelta(-1, 1);
        case Direction.WEST:
            return new DirectionDelta(-1, 0);
        case Direction.NORTHWEST:
            return new DirectionDelta(-1, -1);
        default:
            throw new Error("Unexpected direction!");
    }
}
var Position = /** @class */ (function () {
    function Position(x, y) {
        this.x = x;
        this.y = y;
    }
    Position.move = function (position, direction) {
        var x = position.x, y = position.y;
        var _a = getDeltaFor(direction), xDelta = _a.xDelta, yDelta = _a.yDelta;
        return new Position(x + xDelta, y + yDelta);
    };
    Position.origin = function () {
        return new Position(0, 0);
    };
    Position.prototype.toString = function () {
        return "(".concat(this.x, ", ").concat(this.y, ")");
    };
    return Position;
}());
exports.Position = Position;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";

// EXTERNAL MODULE: ./node_modules/jquery/dist/jquery.js
var jquery = __webpack_require__(692);
;// ./src/config.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */

// All areas of micropolisJS that provide debug options should also check the debug
// value as well as their individual value. The debug flag is intended to switch on all
// debug options.

var Config = {
  debug: false,
  gameDebug: false,
  queryDebug: false
};




;// ./src/miscUtils.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */

var clamp = function(value, min, max) {
  if (value < min)
    return min;
  if (value > max)
    return max;

  return value;
};


var makeConstantDescriptor = function(value) {
  return {configurable: false, enumerable: false,
          writeable: false, value: value};
};


var normaliseDOMid = function(id) {
  return (id[0] !== '#' ? '#' : '') + id;
};


var reflectEvent = function(message, value) {
  this._emitEvent(message, value);
};


var MiscUtils = {
  clamp: clamp,
  makeConstantDescriptor: makeConstantDescriptor,
  normaliseDOMid: normaliseDOMid,
  reflectEvent: reflectEvent
};




// EXTERNAL MODULE: ./src/random.ts
var random = __webpack_require__(737);
// EXTERNAL MODULE: ./src/tile.ts
var src_tile = __webpack_require__(274);
// EXTERNAL MODULE: ./src/tileFlags.ts
var src_tileFlags = __webpack_require__(851);
// EXTERNAL MODULE: ./src/tileValues.ts
var src_tileValues = __webpack_require__(680);
;// ./src/tileUtils.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */






var unwrapTile = function(f) {
  return function(tile) {
    if (tile instanceof src_tile.Tile)
      tile = tile.getValue();
    return f.call(null, tile);
  };
};


var canBulldoze = unwrapTile(function(tileValue) {
  return (tileValue >= src_tileValues.FIRSTRIVEDGE  && tileValue <= src_tileValues.LASTRUBBLE) ||
         (tileValue >= src_tileValues.POWERBASE + 2 && tileValue <= src_tileValues.POWERBASE + 12) ||
         (tileValue >= src_tileValues.TINYEXP       && tileValue <= src_tileValues.LASTTINYEXP + 2);
});


var isCommercial = unwrapTile(function(tile) {
  return tile >= src_tileValues.COMBASE && tile < src_tileValues.INDBASE;
});


var isCommercialZone = function(tile) {
  return tile.isZone() && isCommercial(tile);
};


var isDriveable = unwrapTile(function(tile) {
  return (tile >= src_tileValues.ROADBASE && tile <= src_tileValues.LASTROAD) ||
         (tile >= src_tileValues.RAILHPOWERV && tile <= src_tileValues.LASTRAIL);
});


var isFire = unwrapTile(function(tile) {
  return tile >= src_tileValues.FIREBASE && tile < src_tileValues.ROADBASE;
});


var isFlood = unwrapTile(function(tile) {
  return tile >= src_tileValues.FLOOD && tile < src_tileValues.LASTFLOOD;
});


var isIndustrial = unwrapTile(function(tile) {
  return tile >= src_tileValues.INDBASE && tile < src_tileValues.PORTBASE;
});


var isIndustrialZone = function(tile) {
  return tile.isZone() && isIndustrial(tile);
};


var isManualExplosion = unwrapTile(function(tile) {
  return tile >= src_tileValues.TINYEXP && tile <= src_tileValues.LASTTINYEXP;
});


var isRail = unwrapTile(function(tile) {
  return tile >= src_tileValues.RAILBASE && tile < src_tileValues.RESBASE;
});


var isResidential = unwrapTile(function(tile) {
  return tile >= src_tileValues.RESBASE && tile < src_tileValues.HOSPITALBASE;
});


var isResidentialZone = function(tile) {
  return tile.isZone() && isResidential(tile);
};


var isRoad = unwrapTile(function(tile) {
  return tile >= src_tileValues.ROADBASE && tile < src_tileValues.POWERBASE;
});


var normalizeRoad = unwrapTile(function(tile) {
  return (tile >= src_tileValues.ROADBASE && tile <= src_tileValues.LASTROAD + 1) ? (tile & 15) + 64 : tile;
});


var randomFire = function() {
  return new src_tile.Tile(src_tileValues.FIRE + (random.Random.getRandom16() & 3), src_tileFlags.ANIMBIT);
};


var randomRubble = function() {
  return new src_tile.Tile(src_tileValues.RUBBLE + (random.Random.getRandom16() & 3), src_tileFlags.BULLBIT);
};


var TileUtils = {
  canBulldoze: canBulldoze,
  isCommercial: isCommercial,
  isCommercialZone: isCommercialZone,
  isDriveable: isDriveable,
  isFire: isFire,
  isFlood: isFlood,
  isIndustrial: isIndustrial,
  isIndustrialZone: isIndustrialZone,
  isManualExplosion: isManualExplosion,
  isRail: isRail,
  isResidential: isResidential,
  isResidentialZone: isResidentialZone,
  isRoad: isRoad,
  normalizeRoad: normalizeRoad,
  randomFire: randomFire,
  randomRubble: randomRubble
};




;// ./src/worldEffects.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */



function WorldEffects(map) {
  this._map = map;
  this._data = {};
}


var toKey = function(x, y) {
  return [x, y].join(',');
};


var fromKey = function(k) {
  k = k.split(',');
  return {x: k[0] - 0, y: k[1] - 0, toString: function() {return 'World effect coord: (' + k[0] + ', ' + k[1] + ')';}};
};


WorldEffects.prototype.clear = function() {
  this._data = [];
};


WorldEffects.prototype.getTile = function(x, y) {
  var key = toKey(x, y);
  var tile = this._data[key];
  if (tile === undefined)
    tile = this._map.getTile(x, y);
  return tile;
};


WorldEffects.prototype.getTileValue = function(x, y) {
  return this.getTile(x, y).getValue();
};


WorldEffects.prototype.setTile = function(x, y, value, flags) {
  if (flags !== undefined && value instanceof src_tile.Tile)
    throw new Error('Flags supplied with already defined tile');

  if (!this._map.testBounds(x, y))
    throw new Error('WorldEffects setTile called with invalid bounds ' + x + ', ' + y);

  if (flags === undefined && !(value instanceof src_tile.Tile))
    value = new src_tile.Tile(value);
  else if (flags !== undefined)
    value = new src_tile.Tile(value, flags);

  var key = toKey(x, y);
  this._data[key] = value;
};


WorldEffects.prototype.apply = function() {
  var keys = Object.keys(this._data);
  for (var i = 0, l = keys.length; i < l; i++) {
    var coords = fromKey(keys[i]);
    this._map.setTo(coords, this._data[keys[i]]);
  }
};




;// ./src/baseTool.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */






var init = function(cost, map, shouldAutoBulldoze, isDraggable) {
  isDraggable = isDraggable || false;
  Object.defineProperty(this, 'toolCost', MiscUtils.makeConstantDescriptor(cost));
  this.result = null;
  this.isDraggable = isDraggable;
  this._shouldAutoBulldoze = shouldAutoBulldoze;
  this._map = map;
  this._worldEffects = new WorldEffects(map);
  this._applicationCost = 0;
};


var clear = function() {
  this._applicationCost = 0;
  this._worldEffects.clear();
};


var addCost = function(cost) {
  this._applicationCost += cost;
};


var doAutoBulldoze = function(x, y) {
  var tile = this._worldEffects.getTile(x, y);
  if (tile.isBulldozable()) {
    tile = TileUtils.normalizeRoad(tile.getValue());
    if ((tile >= src_tileValues.TINYEXP && tile <= src_tileValues.LASTTINYEXP) ||
        (tile < src_tileValues.HBRIDGE && tile !== src_tileValues.DIRT)) {
      this.addCost(1);
      this._worldEffects.setTile(x, y, src_tileValues.DIRT);
    }
  }
};


var apply = function(budget) {
  this._worldEffects.apply();
  budget.spend(this._applicationCost);
  this.clear();
};


var modifyIfEnoughFunding = function(budget) {
  if (this.result !== this.TOOLRESULT_OK) {
    this.clear();
    return false;
  }

  if (budget.totalFunds < this._applicationCost) {
    this.result = this.TOOLRESULT_NO_MONEY;
    this.clear();
    return false;
  }

  apply.call(this, budget);
  this.clear();
  return true;
};


var TOOLRESULT_OK = 0;
var TOOLRESULT_FAILED = 1;
var TOOLRESULT_NO_MONEY = 2;
var TOOLRESULT_NEEDS_BULLDOZE = 3;

var BaseToolConstructor = {
  addCost: addCost,
  autoBulldoze: true,
  bulldozerCost: 1,
  clear: clear,
  doAutoBulldoze: doAutoBulldoze,
  init: init,
  modifyIfEnoughFunding: modifyIfEnoughFunding,
  TOOLRESULT_OK: TOOLRESULT_OK,
  TOOLRESULT_FAILED: TOOLRESULT_FAILED,
  TOOLRESULT_NO_MONEY: TOOLRESULT_NO_MONEY,
  TOOLRESULT_NEEDS_BULLDOZE: TOOLRESULT_NEEDS_BULLDOZE
};


var save = function(saveData) {
  saveData.autoBulldoze = BaseToolConstructor.autoBulldoze;
};


var load = function(saveData) {
  BaseTool.autoBulldoze = saveData.autoBulldoze;
};


var makeTool = function(toolConstructor) {
  toolConstructor.prototype = Object.create(BaseToolConstructor);
  return toolConstructor;
};


var BaseTool = {
  makeTool: makeTool,
  setAutoBulldoze: function(value) {
    BaseToolConstructor.autoBulldoze = value;
  },
  getAutoBulldoze: function() {
    return BaseToolConstructor.autoBulldoze;
  },
  save: save,
  load: load
};



// EXTERNAL MODULE: ./src/messages.ts
var messages = __webpack_require__(910);
var messages_namespaceObject = /*#__PURE__*/__webpack_require__.t(messages, 2);
;// ./src/eventEmitter.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */



// Decorate the given object, by adding {add|remove}EventListener methods, and an internal '_emitEvent' method
var EventEmitter = function(obj) {
  var events = {};


  var addListener = function(event, listener) {
    if (!(event in events))
      events[event] = [];

    var listeners = events[event];
    if (listeners.indexOf(listener) === -1)
      listeners.push(listener);
  };


  var removeListener = function(event, listener) {
    if (!(event in events))
      events[event] = [];

    var listeners = events[event];
    var index = listeners.indexOf(listener);
    if (index !== -1)
      listeners.splice(index, 1);
  };


  var emitEvent = function(event, value) {
    if (event === undefined) {
      if (!Config.debug)
        console.warn('Sending undefined event!');
      else
        throw new Error('Sending undefined event!');
    }

    if (!(event in events))
      events[event] = [];

    var listeners = events[event];
    for (var i = 0, l = listeners.length; i < l; i++)
      listeners[i](value);
  };


  var addProps = function(obj, message) {
    var hasExistingProp = ['addEventListener', 'removeEventListener', '_emitEvent'].some(function(prop) {
      return obj[prop] !== undefined;
    });

    if (hasExistingProp)
      throw new Error('Cannot decorate ' + message + ': existing properties would be overwritten!');

    obj.addEventListener = addListener;
    obj.removeEventListener = removeListener;
    obj._emitEvent = emitEvent;
  };

  if (typeof(obj) === 'object')
    addProps(obj, 'object');
  else
    addProps(obj.prototype, 'constructor');

  return obj;
};




;// ./src/modalWindow.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */






var ModalWindow = function(constructorFunction, focusID) {
  focusID = focusID ? MiscUtils.normaliseDOMid(focusID) : null;

  var newConstructor = function(opacityLayerID, windowID) {
    this._opacityLayer =  MiscUtils.normaliseDOMid(opacityLayerID);
    this._windowID = MiscUtils.normaliseDOMid(windowID);
    constructorFunction.call(this);
  };


  newConstructor.prototype._toggleDisplay = function() {
    var opacityLayer = jquery(this._opacityLayer);
    opacityLayer = opacityLayer.length === 0 ? null : opacityLayer;
    if (opacityLayer === null)
      throw new Error('Node ' + this._opacityLayer + ' not found');

    var modalWindow = jquery(this._windowID);
    modalWindow = modalWindow.length === 0 ? null : modalWindow;
    if (modalWindow === null)
      throw new Error('Node ' + this._windowID + ' not found');

    opacityLayer.toggle();
    modalWindow.toggle();

    if (focusID !== null)
      jquery(focusID).focus();
    else
      jquery(this._windowID + ' input[type=submit]').focus();
  };


  return EventEmitter(newConstructor);
};




;// ./src/budgetWindow.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */







var BudgetWindow = ModalWindow(function() {
  jquery(budgetCancelID).on('click', cancel.bind(this));
  jquery(budgetResetID).on('click', resetItems.bind(this));
  jquery(budgetFormID).on('submit', budgetWindow_submit.bind(this));
});


var dataKeys = ['roadMaintenanceBudget', 'fireMaintenanceBudget', 'policeMaintenanceBudget'];
var spendKeys = ['roadRate', 'fireRate', 'policeRate'];

var budgetResetID = '#budgetReset';
var budgetCancelID = '#budgetCancel';
var budgetFormID = '#budgetForm';
var budgetOKID = '#budgetOK';


var setSpendRangeText = function(element, percentage, totalSpend) {
  var labelID = element + 'Label';
  var cash = Math.floor(totalSpend * (percentage / 100));
  var text = [percentage, '% of $', totalSpend, ' = $', cash].join('');
  jquery(MiscUtils.normaliseDOMid(labelID)).text(text);
};


var onFundingUpdate = function(elementID, e) {
  var element = jquery(MiscUtils.normaliseDOMid(elementID))[0];
  var percentage = element.value - 0;
  var dataSource = element.getAttribute('data-source');
  setSpendRangeText(elementID, percentage, this[dataSource]);
};


var onTaxUpdate = function(e) {
  var elem = jquery('#taxRateLabel')[0];
  var sourceElem = jquery('#taxRate')[0];
  jquery(elem).text(['Tax rate: ', sourceElem.value, '%'].join(''));
};


var resetItems = function(e) {
  for (var i = 0; i < spendKeys.length; i++) {
    var original = this['original' + spendKeys[i]];
    jquery(MiscUtils.normaliseDOMid(spendKeys[i]))[0].value = original;
    setSpendRangeText(spendKeys[i], original, this[dataKeys[i]]);
  }
  jquery('#taxRate')[0].value = this.originaltaxRate;
  onTaxUpdate();

  e.preventDefault();
};


BudgetWindow.prototype.close = function(data) {
  data = data || {cancelled: true};
  this._emitEvent(messages.BUDGET_WINDOW_CLOSED, data);
  this._toggleDisplay();
};


var cancel = function(e) {
  e.preventDefault();
  this.close({cancelled: true});
};


var budgetWindow_submit = function(e) {
  e.preventDefault();

  // Get element values
  var roadPercent = jquery('#roadRate')[0].value;
  var firePercent = jquery('#fireRate')[0].value;
  var policePercent = jquery('#policeRate')[0].value;
  var taxPercent = jquery('#taxRate')[0].value;

  var data = {cancelled: false, roadPercent: roadPercent, firePercent: firePercent,
                        policePercent: policePercent, taxPercent: taxPercent, e: e, original: e.type};
  this.close(data);
};


BudgetWindow.prototype.open = function(budgetData) {
  var i, elem;

  // Store max funding levels
  for (i = 0; i < dataKeys.length; i++) {
    if (budgetData[dataKeys[i]] === undefined)
      throw new Error('Missing budget data ('  + dataKeys[i] + ')');
    this[dataKeys[i]] = budgetData[dataKeys[i]];
  }

  // Update form elements with percentages, and set up listeners
  for (i = 0; i < spendKeys.length; i++) {
    if (budgetData[spendKeys[i]] === undefined)
      throw new Error('Missing budget data (' + spendKeys[i] + ')');

    elem = spendKeys[i];
    this['original' + elem] = budgetData[elem];
    setSpendRangeText(elem, budgetData[spendKeys[i]], this[dataKeys[i]]);
    elem = jquery(MiscUtils.normaliseDOMid(elem));
    elem.on('change', onFundingUpdate.bind(this, spendKeys[i]));
    elem = elem[0];
    elem.value = budgetData[spendKeys[i]];
  }

  if (budgetData.taxRate === undefined)
    throw new Error('Missing budget data (taxRate)');

  this.originalTaxRate = budgetData.taxRate;
  elem = jquery('#taxRate');
  elem.on('change', onTaxUpdate);
  elem = elem[0];
  elem.value = budgetData.taxRate;
  onTaxUpdate();

  // Update static parts
  var previousFunds = budgetData.totalFunds;
  if (previousFunds === undefined)
    throw new Error('Missing budget data (previousFunds)');

  var taxesCollected = budgetData.taxesCollected;
  if (taxesCollected === undefined)
    throw new Error('Missing budget data (taxesCollected)');

  var cashFlow = taxesCollected - this.roadMaintenanceBudget - this.fireMaintenanceBudget - this.policeMaintenanceBudget;
  var currentFunds = previousFunds + cashFlow;
  jquery('#taxesCollected').text('$' + taxesCollected);
  jquery('#cashFlow').text((cashFlow < 0 ? '-$' : '$') + cashFlow);
  jquery('#previousFunds').text((previousFunds < 0 ? '-$' : '$') + previousFunds);
  jquery('#currentFunds').text('$' + currentFunds);

  this._toggleDisplay();
};




;// ./src/congratsWindow.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */






var CongratsWindow = ModalWindow(function() {
  jquery(congratsFormID).on('submit', congratsWindow_submit.bind(this));
});


var congratsFormID = '#congratsForm';
var congratsMessageID = '#congratsMessage';
var congratsOKID = '#congratsOK';


var congratsWindow_submit = function(e) {
  e.preventDefault();
  this.close();
};


CongratsWindow.prototype.close = function() {
  this._toggleDisplay();
  this._emitEvent(messages.CONGRATS_WINDOW_CLOSED);
};


CongratsWindow.prototype.open = function(message) {
  this._toggleDisplay();
  jquery(congratsMessageID).text(message);
  jquery(congratsOKID).focus();
};




;// ./src/debugWindow.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */







var DebugWindow = ModalWindow(function() {
  jquery(debugCancelID).on('click', debugWindow_cancel.bind(this));
  jquery(debugFormID).on('submit', debugWindow_submit.bind(this));
});


var debugCancelID = '#debugCancel';
var debugFormID = '#debugForm';
var debugOKID = '#debugOK';


DebugWindow.prototype.close = function(actions) {
  actions = actions || [];
  this._emitEvent(messages.DEBUG_WINDOW_CLOSED, actions);
  this._toggleDisplay();
};


var debugWindow_cancel = function(e) {
  e.preventDefault();
  this.close([]);
};


var debugWindow_submit = function(e) {
  e.preventDefault();

  var actions = [];

  // Get element values
  var shouldAdd = jquery('.debugAdd:checked').val();
  if (shouldAdd === 'true')
    actions.push({action: DebugWindow.ADD_FUNDS, data: {}});

  this.close(actions);
};


DebugWindow.prototype.open = function() {
  this._toggleDisplay();
};


var defineAction = (function() {
  var uid = 0;

  return function(name) {
    Object.defineProperty(DebugWindow, name, MiscUtils.makeConstantDescriptor(uid));
    uid += 1;
  };
})();


defineAction('ADD_FUNDS');




;// ./src/disasterWindow.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */







var disasterSelectID = '#disasterSelect';
var disasterCancelID = '#disasterCancel';
var disasterOKID = '#disasterOK';
var disasterFormID = '#disasterForm';


var DisasterWindow = ModalWindow(function() {
  jquery(disasterFormID).on('submit', disasterWindow_submit.bind(this));
  jquery(disasterCancelID).on('click', disasterWindow_cancel.bind(this));
}, disasterSelectID);


DisasterWindow.prototype.close = function(disaster) {
  disaster = disaster || DisasterWindow.DISASTER_NONE;
  this._toggleDisplay();
  this._emitEvent(messages.DISASTER_WINDOW_CLOSED, disaster);
};


var disasterWindow_cancel = function(e) {
  e.preventDefault();
  this.close();
};


var disasterWindow_submit = function(e) {
  e.preventDefault();

  // Get element values
  var requestedDisaster = jquery(disasterSelectID)[0].value;
  this.close(requestedDisaster);
};


DisasterWindow.prototype.open = function() {
  var i;

  // Ensure options have right values
  jquery('#disasterNone').attr('value', DisasterWindow.DISASTER_NONE);
  jquery('#disasterMonster').attr('value', DisasterWindow.DISASTER_MONSTER);
  jquery('#disasterFire').attr('value', DisasterWindow.DISASTER_FIRE);
  jquery('#disasterFlood').attr('value', DisasterWindow.DISASTER_FLOOD);
  jquery('#disasterCrash').attr('value', DisasterWindow.DISASTER_CRASH);
  jquery('#disasterMeltdown').attr('value', DisasterWindow.DISASTER_MELTDOWN);
  jquery('#disasterTornado').attr('value', DisasterWindow.DISASTER_TORNADO);

  this._toggleDisplay();
};


Object.defineProperties(DisasterWindow,
  {DISASTER_NONE: MiscUtils.makeConstantDescriptor('None'),
   DISASTER_MONSTER: MiscUtils.makeConstantDescriptor('Monster'),
   DISASTER_FIRE: MiscUtils.makeConstantDescriptor('Fire'),
   DISASTER_FLOOD: MiscUtils.makeConstantDescriptor('Flood'),
   DISASTER_CRASH: MiscUtils.makeConstantDescriptor('Crash'),
   DISASTER_MELTDOWN: MiscUtils.makeConstantDescriptor('Meltdown'),
   DISASTER_TORNADO: MiscUtils.makeConstantDescriptor('Tornado')});




;// ./src/evaluation.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */






var PROBLEMS = ['CVP_CRIME', 'CVP_POLLUTION', 'CVP_HOUSING', 'CVP_TAXES',
                'CVP_TRAFFIC', 'CVP_UNEMPLOYMENT', 'CVP_FIRE'];
var NUMPROBLEMS = PROBLEMS.length;
var NUM_COMPLAINTS = 4;
var problemData = [];


var Evaluation = EventEmitter(function(gameLevel) {
  this.problemVotes = [];
  this.problemOrder = [];
  this.evalInit();
  this.gameLevel = '' + gameLevel;
});


Evaluation.prototype.cityEvaluation = function(simData) {
  var census = simData.census;

  if (census.totalPop > 0) {
    for (var i = 0; i < NUMPROBLEMS; i++)
      problemData.push(0);

    this.getAssessedValue(census);
    this.getPopulation(census);
    this.doProblems(simData.census, simData.budget, simData.blockMaps);
    this.getScore(simData);
    this.doVotes();
  } else {
    this.evalInit();
    this.cityYes = 50;
  }
};


Evaluation.prototype.evalInit = function() {
  this.cityYes = 0;
  this.cityPop = 0;
  this.cityPopDelta = 0;
  this.cityAssessedValue = 0;
  this.cityClass = Evaluation.CC_VILLAGE;
  this.cityClassLast = Evaluation.CC_VILLAGE;
  this.cityScore = 500;
  this.cityScoreDelta = 0;
  for (var i = 0; i < NUMPROBLEMS; i++)
    this.problemVotes[i] = {index: i, voteCount: 0};

  for (i = 0; i < NUM_COMPLAINTS; i++)
    this.problemOrder[i] = NUMPROBLEMS;
};


var saveProps = ['cityClass', 'cityScore'];

Evaluation.prototype.save = function(saveData) {
  for (var i = 0, l = saveProps.length; i < l; i++)
    saveData[saveProps[i]] = this[saveProps[i]];
};


Evaluation.prototype.load = function(saveData) {
  for (var i = 0, l = saveProps.length; i < l; i++)
    this[saveProps[i]] = saveData[saveProps[i]];
};


Evaluation.prototype.getAssessedValue = function(census) {
  var value;

  value = census.roadTotal * 5;
  value += census.railTotal * 10;
  value += census.policeStationPop * 1000;
  value += census.fireStationPop * 1000;
  value += census.hospitalPop * 400;
  value += census.stadiumPop * 3000;
  value += census.seaportPop * 5000;
  value += census.airportPop * 10000;
  value += census.coalPowerPop * 3000;
  value += census.nuclearPowerPop * 6000;

  this.cityAssessedValue = value * 1000;
};


Evaluation.prototype.getPopulation = function(census) {
  var oldPopulation = this.cityPop;
  this.cityPop = (census.resPop + (census.comPop + census.indPop) * 8) * 20;
  this.cityPopDelta = this.cityPop - oldPopulation;

  if (this.cityPopDelta !== 0)
    this._emitEvent(messages.POPULATION_UPDATED, this.cityPop);

  return this.cityPop;
};


Evaluation.prototype.getCityClass = function(cityPopulation) {
  this.cityClass = Evaluation.CC_VILLAGE;

  if (cityPopulation > 2000)
      this.cityClass = Evaluation.CC_TOWN;

  if (cityPopulation > 10000)
      this.cityClass = Evaluation.CC_CITY;

  if (cityPopulation > 50000)
      this.cityClass = Evaluation.CC_CAPITAL;

  if (cityPopulation > 100000)
      this.cityClass = Evaluation.CC_METROPOLIS;

  if (cityPopulation > 500000)
      this.cityClass = Evaluation.CC_MEGALOPOLIS;

  if (this.cityClass !== this.cityClassLast) {
    this.cityClassLast = this.cityClass;
    this._emitEvent(messages.CLASSIFICATION_UPDATED, this.cityClass);
  }

  return this.cityClass;
};


Evaluation.prototype.voteProblems = function() {
  for (var i = 0; i < NUMPROBLEMS; i++) {
    this.problemVotes[i].index = i;
    this.problemVotes[i].voteCount = 0;
  }

  var problem = 0;
  var voteCount = 0;
  var loopCount = 0;

  // Try to acquire up to 100 votes on problems, but bail if it takes too long
  while (voteCount < 100 && loopCount < 600) {
    var voterProblemTolerance = random.Random.getRandom(300);
    if (problemData[problem] > voterProblemTolerance) {
      // The voter is upset about this problem
      this.problemVotes[problem].voteCount += 1;
      voteCount++;
    }

    problem = (problem + 1) % NUMPROBLEMS;
    loopCount++;
  }
};


var getTrafficAverage = function(blockMaps, census) {
  var trafficDensityMap = blockMaps.trafficDensityMap;
  var landValueMap = blockMaps.landValueMap;

  var trafficTotal = 0;
  var count = 1;

  for (var x = 0; x < landValueMap.gameMapWidth; x += landValueMap.blockSize) {
    for (var y = 0; y < landValueMap.gameMapHeight; y += landValueMap.blockSize) {
      if (landValueMap.worldGet(x, y) > 0) {
        trafficTotal += trafficDensityMap.worldGet(x, y);
        count++;
      }
    }
  }

  var trafficAverage = census.trafficAverage = Math.floor(trafficTotal / count) * 2.4;

  return trafficAverage;
};


var getUnemployment = function(census) {
  var b = (census.comPop + census.indPop) * 8;

  if (b === 0)
      return 0;

  // Ratio total people / working. At least 1.
  var r = census.resPop / b;

  b = Math.round((r - 1) * 255);
  return Math.min(b, 255);
};


var getFireSeverity = function(census) {
  return Math.min(census.firePop * 5, 255);
};


Evaluation.prototype.doProblems = function(census, budget, blockMaps) {
  problemData[Evaluation.CRIME]        = census.crimeAverage;
  problemData[Evaluation.POLLUTION]    = census.pollutionAverage;
  problemData[Evaluation.HOUSING]      = census.landValueAverage * 7 / 10;
  problemData[Evaluation.TAXES]        = budget.cityTax * 10;
  problemData[Evaluation.TRAFFIC]      = getTrafficAverage(blockMaps, census);
  problemData[Evaluation.UNEMPLOYMENT] = getUnemployment(census);
  problemData[Evaluation.FIRE]         = getFireSeverity(census);

  this.voteProblems();

  // Rank the problems
  this.problemVotes.sort(function(a, b) {
    return b.voteCount - a.voteCount;
  });

  this.problemOrder = this.problemVotes.map(function(pv, i) {
    if (i >= NUM_COMPLAINTS || pv.voteCount === 0)
      return null;

    return pv.index;
  });
};


Evaluation.prototype.getScore = function(simData) {
  var census = simData.census;
  var budget = simData.budget;
  var valves = simData.valves;

  var cityScoreLast = this.cityScore;
  var score = 0;

  for (var i = 0; i < NUMPROBLEMS; i++)
    score += problemData[i];

  score = Math.floor(score / 3);
  score = (250 - Math.min(score, 250)) * 4;

  // Penalise the player by 15% if demand for any type of zone is capped due
  // to lack of suitable buildings
  var demandPenalty = 0.85;

  if (valves.resCap)
    score = Math.round(score * demandPenalty);

  if (valves.comCap)
    score = Math.round(score * demandPenalty);

  if (valves.indCap)
    score = Math.round(score * demandPenalty);

  // Penalize if roads/rail underfunded
  if (budget.roadEffect < budget.MAX_ROAD_EFFECT)
    score -= budget.MAX_ROAD_EFFECT - budget.roadEffect;

  // Penalize player by up to 10% for underfunded police and fire services
  if (budget.policeEffect < budget.MAX_POLICE_STATION_EFFECT)
    score = Math.round(score * (0.9 + (budget.policeEffect / (10 * budget.MAX_POLICE_STATION_EFFECT))));

  if (budget.fireEffect < budget.MAX_FIRE_STATION_EFFECT)
    score = Math.round(score * (0.9 + (budget.fireEffect / (10 * budget.MAX_FIRE_STATION_EFFECT))));

  // Penalise the player by 15% if demand for any type of zone has collapsed due
  // to overprovision
  if (valves.resValve < -1000)
    score = Math.round(score * 0.85);

  if (valves.comValve < -1000)
    score = Math.round(score * 0.85);

  if (valves.indValve < -1000)
    score = Math.round(score * 0.85);

  var scale = 1.0;
  if (this.cityPop === 0 || this.cityPopDelta === 0 || this.cityPopDelta === this.cityPop) {
    // Leave score unchanged if city is empty, if there hasn't been any migration, if the
    // initial settlers have just arrived, or if the city has doubled in size
    scale = 1.0;
  } else if (this.cityPopDelta > 0) {
    // If the city is growing, scale score by percentage growth in population
    scale = (this.cityPopDelta / this.cityPop) + 1.0;
  } else if (this.cityPopDelta < 0) {
    // If the city is shrinking, scale down by up to 5% based on level of outward migration
    scale = 0.95 + Math.floor(this.cityPopDelta / (this.cityPop - this.cityPopDelta));
  }

  score = Math.round(score * scale);

  // Penalize player for having fires and a burdensome tax rate
  score = score - getFireSeverity(census) - budget.cityTax;

  // Penalize player based on ratio of unpowered zones to total zones
  scale = census.unpoweredZoneCount + census.poweredZoneCount;
  if (scale > 0)
    score = Math.round(score * (census.poweredZoneCount / scale));

  // Force in to range 0-1000. New score is average of last score and new computed value
  score = MiscUtils.clamp(score, 0, 1000);
  this.cityScore = Math.round((this.cityScore + score) / 2);

  this.cityScoreDelta = this.cityScore - cityScoreLast;

  if (this.cityScoreDelta !== 0)
    this._emitEvent(messages.SCORE_UPDATED, this.cityScore);
};


Evaluation.prototype.doVotes = function() {
  // Survey 100 voters on the mayor's performance
  this.cityYes = 0;

  for (var i = 0; i < 100; i++) {
    var voterExpectation = random.Random.getRandom(1000);
    if (this.cityScore > voterExpectation)
      this.cityYes++;
  }
};


Evaluation.prototype.getProblemNumber = function(i) {
  if (i < 0 || i >= NUM_COMPLAINTS)
    return null;

  return this.problemOrder[i];
};


Object.defineProperties(Evaluation,
  {CC_VILLAGE: MiscUtils.makeConstantDescriptor('VILLAGE'),
  CC_TOWN: MiscUtils.makeConstantDescriptor('TOWN'),
  CC_CITY: MiscUtils.makeConstantDescriptor('CITY'),
  CC_CAPITAL: MiscUtils.makeConstantDescriptor('CAPITAL'),
  CC_METROPOLIS: MiscUtils.makeConstantDescriptor('METROPOLIS'),
  CC_MEGALOPOLIS: MiscUtils.makeConstantDescriptor('MEGALOPOLIS'),
  CRIME: MiscUtils.makeConstantDescriptor(0),
  POLLUTION: MiscUtils.makeConstantDescriptor(1),
  HOUSING: MiscUtils.makeConstantDescriptor(2),
  TAXES: MiscUtils.makeConstantDescriptor(3),
  TRAFFIC: MiscUtils.makeConstantDescriptor(4),
  UNEMPLOYMENT: MiscUtils.makeConstantDescriptor(5),
  FIRE: MiscUtils.makeConstantDescriptor(6)});


// EXTERNAL MODULE: ./src/blockMap.ts
var blockMap = __webpack_require__(639);
// EXTERNAL MODULE: ./src/direction.ts
var direction = __webpack_require__(441);
// EXTERNAL MODULE: ./src/position.ts
var position = __webpack_require__(973);
// EXTERNAL MODULE: ./src/spriteConstants.ts
var spriteConstants = __webpack_require__(958);
;// ./src/zoneUtils.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */





var checkBigZone = function(tileValue) {
  var result;

  switch (tileValue) {

    case src_tileValues.POWERPLANT:
    case src_tileValues.PORT:
    case src_tileValues.NUCLEAR:
    case src_tileValues.STADIUM:
      result = {zoneSize: 4, deltaX: 0, deltaY: 0};
      break;

    case src_tileValues.POWERPLANT + 1:
    case src_tileValues.COALSMOKE3:
    case src_tileValues.COALSMOKE3 + 1:
    case src_tileValues.COALSMOKE3 + 2:
    case src_tileValues.PORT + 1:
    case src_tileValues.NUCLEAR + 1:
    case src_tileValues.STADIUM + 1:
      result = {zoneSize: 4, deltaX: -1, deltaY: 0};
      break;

    case src_tileValues.POWERPLANT + 4:
    case src_tileValues.PORT + 4:
    case src_tileValues.NUCLEAR + 4:
    case src_tileValues.STADIUM + 4:
      result = {zoneSize: 4, deltaX: 0, deltaY: -1};
      break;

    case src_tileValues.POWERPLANT + 5:
    case src_tileValues.PORT + 5:
    case src_tileValues.NUCLEAR + 5:
    case src_tileValues.STADIUM + 5:
      result = {zoneSize: 4, deltaX: -1, deltaY: -1};
      break;

    case src_tileValues.AIRPORT:
      result = {zoneSize: 6, deltaX: 0, deltaY: 0};
      break;

    case src_tileValues.AIRPORT + 1:
      result = {zoneSize: 6, deltaX: -1, deltaY: 0};
      break;

    case src_tileValues.AIRPORT + 2:
      result = {zoneSize: 6, deltaX: -2, deltaY: 0};
      break;

    case src_tileValues.AIRPORT + 3:
      result = {zoneSize: 6, deltaX: -3, deltaY: 0};
      break;

    case src_tileValues.AIRPORT + 6:
      result = {zoneSize: 6, deltaX: 0, deltaY: -1};
      break;

    case src_tileValues.AIRPORT + 7:
      result = {zoneSize: 6, deltaX: -1, deltaY: -1};
      break;

    case src_tileValues.AIRPORT + 8:
      result = {zoneSize: 6, deltaX: -2, deltaY: -1};
      break;

    case src_tileValues.AIRPORT + 9:
      result = {zoneSize: 6, deltaX: -3, deltaY: -1};
      break;

    case src_tileValues.AIRPORT + 12:
      result = {zoneSize: 6, deltaX: 0, deltaY: -2};
      break;

    case src_tileValues.AIRPORT + 13:
      result = {zoneSize: 6, deltaX: -1, deltaY: -2};
      break;

    case src_tileValues.AIRPORT + 14:
      result = {zoneSize: 6, deltaX: -2, deltaY: -2};
      break;

    case src_tileValues.AIRPORT + 15:
      result = {zoneSize: 6, deltaX: -3, deltaY: -2};
      break;

    case src_tileValues.AIRPORT + 18:
      result = {zoneSize: 6, deltaX: 0, deltaY: -3};
      break;

    case src_tileValues.AIRPORT + 19:
      result = {zoneSize: 6, deltaX: -1, deltaY: -3};
      break;

    case src_tileValues.AIRPORT + 20:
      result = {zoneSize: 6, deltaX: -2, deltaY: -3};
      break;

    case src_tileValues.AIRPORT + 21:
      result = {zoneSize: 6, deltaX: -3, deltaY: -3};
      break;

    default:
      result = {zoneSize: 0, deltaX: 0, deltaY: 0};
      break;
  }

  return result;
};


var checkZoneSize = function(tileValue) {
  if ((tileValue >= src_tileValues.RESBASE - 1        && tileValue <= src_tileValues.PORTBASE - 1) ||
      (tileValue >= src_tileValues.LASTPOWERPLANT + 1 && tileValue <= src_tileValues.POLICESTATION + 4) ||
      (tileValue >= src_tileValues.CHURCH1BASE && tileValue <= src_tileValues.CHURCH7LAST)) {
    return 3;
  }

  if ((tileValue >= src_tileValues.PORTBASE    && tileValue <= src_tileValues.LASTPORT) ||
      (tileValue >= src_tileValues.COALBASE    && tileValue <= src_tileValues.LASTPOWERPLANT) ||
      (tileValue >= src_tileValues.STADIUMBASE && tileValue <= src_tileValues.LASTZONE)) {
    return 4;
  }

  return 0;
};


var fireZone = function(map, x, y, blockMaps) {
  var tileValue = map.getTileValue(x, y);
  var zoneSize = 2;

  // A zone being on fire naturally hurts growth
  var value = blockMaps.rateOfGrowthMap.worldGet(x, y);
  value = MiscUtils.clamp(value - 20, -200, 200);
  blockMaps.rateOfGrowthMap.worldSet(x, y, value);

  if (tileValue === src_tileValues.AIRPORT)
    zoneSize = 5;
  else if (tileValue >= src_tileValues.PORTBASE)
    zoneSize = 3;
  else if (tileValue < src_tileValues.PORTBASE)
      zoneSize = 2;

  // Make remaining tiles of the zone bulldozable
  for (var xDelta = -1; xDelta < zoneSize; xDelta++) {
    for (var yDelta = -1; yDelta < zoneSize; yDelta++) {
      var xTem = x + xDelta;
      var yTem = y + yDelta;

      if (!map.testBounds(xTem, yTem))
        continue;

      if (map.getTileValue(xTem, yTem >= src_tileValues.ROADBASE))
        map.addTileFlags(xTem, yTem, src_tileFlags.BULLBIT);
    }
  }
};


var getLandPollutionValue = function(blockMaps, x, y) {
  var landValue = blockMaps.landValueMap.worldGet(x, y);
  landValue -= blockMaps.pollutionDensityMap.worldGet(x, y);

  if (landValue < 30)
    return 0;
  if (landValue < 80)
    return 1;
  if (landValue < 150)
    return 2;

  return 3;
};


var incRateOfGrowth = function(blockMaps, x, y, growthDelta) {
  var currentRate = blockMaps.rateOfGrowthMap.worldGet(x, y);
  // TODO why the scale of 4 here
  var newValue = MiscUtils.clamp(currentRate + growthDelta * 4, -200, 200);
  blockMaps.rateOfGrowthMap.worldSet(x, y, newValue);
};


// Calls map.putZone after first checking for flood, fire
// and radiation. Should be called with coordinates of centre tile.
var putZone = function(map, x, y, centreTile, isPowered) {
  for (var dY = -1; dY < 2; dY++) {
    for (var dX = -1; dX < 2; dX++) {
      var tileValue = map.getTileValue(x + dX, y + dY);
      if (tileValue >= src_tileValues.FLOOD && tileValue < src_tileValues.ROADBASE)
        return;
    }
  }
  map.putZone(x, y, centreTile, 3);
  map.addTileFlags(x, y, src_tileFlags.BULLBIT);
  if (isPowered)
    map.addTileFlags(x, y, src_tileFlags.POWERBIT);
};


var ZoneUtils = {
  checkBigZone: checkBigZone,
  checkZoneSize: checkZoneSize,
  fireZone: fireZone,
  getLandPollutionValue: getLandPollutionValue,
  incRateOfGrowth: incRateOfGrowth,
  putZone: putZone
};




;// ./src/spriteUtils.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */





var pixToWorld = function(p) {
  return p >> 4;
};


var worldToPix = function(w) {
  return w << 4;
};


// Attempt to move 45° towards the desired direction, either
// clockwise or anticlockwise, whichever gets us there quicker
var turnTo = function(presentDir, desiredDir) {
  if (presentDir === desiredDir)
      return presentDir;

  if (presentDir < desiredDir) {
    // select clockwise or anticlockwise
    if (desiredDir - presentDir < 4)
      presentDir++;
    else
      presentDir--;
  } else {
    if (presentDir - desiredDir < 4)
      presentDir--;
    else
      presentDir++;
  }

  if (presentDir > 8)
    presentDir = 1;

  if (presentDir < 1)
    presentDir = 8;

  return presentDir;
};


var getTileValue = function(map, x, y) {
  var wX = pixToWorld(x);
  var wY = pixToWorld(y);

  if (wX < 0 || wX >= map.width || wY < 0 || wY >= map.height)
    return -1;

  return map.getTileValue(wX, wY);
};


// Choose the best direction to get from the origin to the destination
// If the destination is equidistant in both x and y deltas, a diagonal
// will be chosen, otherwise the most 'dominant' difference will be selected
// (so if a destination is 4 units north and 2 units east, north will be chosen).
// This code seems to always choose south if we're already there which seems like
// a bug
var directionTable = [0, 3, 2, 1, 3, 4, 5, 7, 6, 5, 7, 8, 1];

var getDir = function(orgX, orgY, destX, destY) {
  var deltaX = destX - orgX;
  var deltaY = destY - orgY;
  var i;

  if (deltaX < 0) {
    if (deltaY < 0) {
      i = 11;
    } else {
      i = 8;
    }
  } else {
    if (deltaY < 0) {
      i = 2;
    } else {
      i = 5;
    }
  }

  deltaX = Math.abs(deltaX);
  deltaY = Math.abs(deltaY);

  if (deltaX * 2 < deltaY)
    i++;
  else if (deltaY * 2 < deltaX)
    i--;

  if (i < 0 || i > 12)
    i = 0;

  return directionTable[i];
};


var absoluteDistance = function(orgX, orgY, destX, destY) {
  var deltaX = destX - orgX;
  var deltaY = destY - orgY;
  return Math.abs(deltaX) + Math.abs(deltaY);
};


var checkWet = function(tileValue) {
  if (tileValue === src_tileValues.HPOWER || tileValue === src_tileValues.VPOWER ||
      tileValue === src_tileValues.HRAIL || tileValue === src_tileValues.VRAIL ||
      tileValue === src_tileValues.BRWH || tileValue === src_tileValues.BRWV)
    return true;
  else
    return false;
};


var destroyMapTile = function(spriteManager, map, blockMaps, ox, oy) {
  var x = pixToWorld(ox);
  var y = pixToWorld(oy);

  if (!map.testBounds(x, y))
    return;

  var tile = map.getTile(x, y);
  var tileValue = tile.getValue();

  if (tileValue < src_tileValues.TREEBASE)
    return;

  if (!tile.isCombustible()) {
    if (tileValue >= src_tileValues.ROADBASE && tileValue <= src_tileValues.LASTROAD)
      map.setTile(x, y, src_tileValues.RIVER, 0);

    return;
  }

  if (tile.isZone()) {
    ZoneUtils.fireZone(map, x, y, blockMaps);

    if (tileValue > src_tileValues.RZB)
      spriteManager.makeExplosionAt(ox, oy);
  }

  if (checkWet(tileValue))
    map.setTile(x, y, src_tileValues.RIVER, 0);
  else
    map.setTile(x, y, src_tileValues.TINYEXP, src_tileFlags.BULLBIT | src_tileFlags.ANIMBIT);
};


var getDistance = function(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};


var checkSpriteCollision = function(s1, s2) {
  return s1.frame !== 0 && s2.frame !== 0 &&
         getDistance(s1.x, s1.y, s2.x, s2.y) < 30;
};


var SpriteUtils = {
  absoluteDistance: absoluteDistance,
  checkSpriteCollision: checkSpriteCollision,
  destroyMapTile: destroyMapTile,
  getDir: getDir,
  getTileValue: getTileValue,
  turnTo: turnTo,
  pixToWorld: pixToWorld,
  worldToPix: worldToPix
};




;// ./src/traffic.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */










function Traffic(map, spriteManager) {
  this._map = map;
  this._stack = [];
  this._spriteManager = spriteManager;
}


Traffic.prototype.makeTraffic = function(x, y, blockMaps, destFn) {
  this._stack = [];

  var pos = new position.Position(x, y);

  if (this.findPerimeterRoad(pos)) {
    if (this.tryDrive(pos, destFn)) {
      this.addToTrafficDensityMap(blockMaps);
      return Traffic.ROUTE_FOUND;
    }

    return Traffic.NO_ROUTE_FOUND;
  } else {
    return Traffic.NO_ROAD_FOUND;
  }
};


Traffic.prototype.addToTrafficDensityMap = function(blockMaps) {
  var trafficDensityMap = blockMaps.trafficDensityMap;

  while (this._stack.length > 0) {
    var pos = this._stack.pop();

    // Could this happen?!?
    if (!this._map.testBounds(pos.x, pos.y))
      continue;

    var tileValue = this._map.getTileValue(pos.x, pos.y);

    if (tileValue >= src_tileValues.ROADBASE && tileValue < src_tileValues.POWERBASE) {
      // Update traffic density.
      var traffic = trafficDensityMap.worldGet(pos.x, pos.y);
      traffic += 50;
      traffic = Math.min(traffic, 240);
      trafficDensityMap.worldSet(pos.x, pos.y, traffic);

      // Attract traffic copter to the traffic
      if (traffic >= 240 && random.Random.getRandom(5) === 0) {
        var sprite = this._spriteManager.getSprite(spriteConstants/* SPRITE_HELICOPTER */.MT);
        if (sprite !== null) {
          sprite.destX = SpriteUtils.worldToPix(pos.x);
          sprite.destY = SpriteUtils.worldToPix(pos.y);
        }
      }
    }
  }
};


var perimX = [-1, 0, 1, 2, 2, 2, 1, 0,-1,-2,-2,-2];
var perimY = [-2,-2,-2,-1, 0, 1, 2, 2, 2, 1, 0,-1];

Traffic.prototype.findPerimeterRoad = function(pos) {
  for (var i = 0; i < 12; i++) {
    var xx = pos.x + perimX[i];
    var yy = pos.y + perimY[i];

    if (this._map.testBounds(xx, yy)) {
      if (TileUtils.isDriveable(this._map.getTileValue(xx, yy))) {
        pos.x = xx;
        pos.y = yy;
        return true;
      }
    }
  }

  return false;
};


var MAX_TRAFFIC_DISTANCE = 30;

Traffic.prototype.tryDrive = function(startPos, destFn) {
  var dirLast;
  var drivePos = new position.Position(startPos);

  /* Maximum distance to try */
  for (var dist = 0; dist < MAX_TRAFFIC_DISTANCE; dist++) {
    var  dir = this.tryGo(drivePos, dirLast);
    if (dir) {
      drivePos = position.Position.move(pos, dir);
      dirLast = dir.oppositeDirection();

      if (dist & 1)
        this._stack.push(new position.Position(drivePos));

      if (this.driveDone(drivePos, destFn))
        return true;
    } else {
      if (this._stack.length > 0) {
        this._stack.pop();
        dist += 3;
      } else {
        return false;
      }
    }
  }

  return false;
};


Traffic.prototype.tryGo = function(pos, dirLast) {
  var directions = [];

  // Find connections from current position.
  var count = 0;

  (0,direction.forEachCardinalDirection)(dir => {
    if (dir != dirLast && TileUtils.isDriveable(this._map.getTileFromMapOrDefault(pos, dir, src_tileValues.DIRT))) {
      directions.push(dir);
      count++;
    }
  });

  if (count === 0) {
    return;
  }

  if (count === 1) {
    return directions[0];
  }

  const index = random.Random.getRandom(directions.length - 1);
  return directions[index];
};


Traffic.prototype.driveDone = function(pos, destFn) {
  if (pos.y > 0) {
    if (destFn(this._map.getTileValue(pos.x, pos.y - 1)))
      return true;
  }

  if (pos.x < (this._map.width - 1)) {
    if (destFn(this._map.getTileValue(pos.x + 1, pos.y)))
      return true;
  }

  if (pos.y < (this._map.height - 1)) {
    if (destFn(this._map.getTileValue(pos.x, pos.y + 1)))
      return true;
  }

  if (pos.x > 0) {
    if (destFn(this._map.getTileValue(pos.x - 1, pos.y)))
      return true;
  }

  return false;
};


Object.defineProperties(Traffic,
  {ROUTE_FOUND: MiscUtils.makeConstantDescriptor(1),
   NO_ROUTE_FOUND: MiscUtils.makeConstantDescriptor(0),
   NO_ROAD_FOUND: MiscUtils.makeConstantDescriptor(-1)});




;// ./src/commercial.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */







// There are 20 types of commercial zone aside from the empty zone. They reflect 5 different categories of
// population, and 4 grades of land value/pollution. Population value 1/low value corresponds to the 9 tiles
// starting at 428, population value 2/low follows at 437, and so on.


// Given the centre of a commercial zone, compute it's population level (a number in the range 0-5)
var getZonePopulation = function(map, x, y, tileValue) {
  if (tileValue === src_tileValues.COMCLR)
    return 0;

  return Math.floor((tileValue - src_tileValues.CZB) / 9) % 5 + 1;
};


// Takes a map and coordinates, a population category in the range 1-5, a value category in the range 0-3, and places
// the appropriate industrial zone on the map
var placeCommercial = function(map, x, y, population, lpValue, zonePower) {
  var centreTile = ((lpValue * 5) + population) * 9 + src_tileValues.CZB;
  ZoneUtils.putZone(map, x, y, centreTile, zonePower);
};


var growZone = function(map, x, y, blockMaps, population, lpValue, zonePower) {
  // landValueMap contains values in the range 0-250, representing the desirability of the land.
  // Thus, after shifting, landValue will be in the range 0-7.
  var landValue = blockMaps.landValueMap.worldGet(x, y);
  landValue = landValue >> 5;

  if (population > landValue)
    return;

  // This zone is desirable, and seemingly not to crowded. Switch to the next category of zone.
  if (population < 5) {
    placeCommercial(map, x, y, population, lpValue, zonePower);
    ZoneUtils.incRateOfGrowth(blockMaps, x, y, 8);
  }
};


var degradeZone = function(map, x, y, blockMaps, populationCategory, lpCategory, zonePower) {
  // Note that we special case empty zones here, rather than having to check population value on every
  // call to placeIndustrial (which we anticipate will be called more often)
  if (populationCategory > 1) {
    placeCommercial(map, x, y, populationCategory - 2, lpCategory, zonePower);
  } else {
    ZoneUtils.putZone(map, x, y, src_tileValues.COMCLR, zonePower);
  }

  ZoneUtils.incRateOfGrowth(blockMaps, x, y, -8);
};


// Called by the map scanner when it finds the centre of an commercial zone
var commercialFound = function(map, x, y, simData) {
  // lpValue will be filled if we actually decide to trigger growth/decay. It will be an index of the land/pollution
  // value in the range 0-3
  var lpValue;

  // Notify the census
  simData.census.comZonePop += 1;

  // Calculate the population level for this tile, and add to census
  var tileValue = map.getTileValue(x, y);
  var population = getZonePopulation(map, x, y, tileValue);
  simData.census.comPop += population;

  var zonePower = map.getTile(x, y).isPowered();

  // Occasionally check to see if the zone is connected to the transport network (the chance of this happening
  // increases as the population increases). Growth naturally stalls if consumers cannot reach the shops.
  // Note in particular, we will never take this branch if the zone is empty.
  var trafficOK = Traffic.ROUTE_FOUND;
  if (population > random.Random.getRandom(5)) {
    // Try to find a route from here to an industrial zone
    trafficOK = simData.trafficManager.makeTraffic(x, y, simData.blockMaps, TileUtils.isIndustrial);

    // Trigger outward migration if not connected to road network
    if (trafficOK === Traffic.NO_ROAD_FOUND) {
      lpValue = ZoneUtils.getLandPollutionValue(simData.blockMaps, x, y);
      degradeZone(map, x, y, simData.blockMaps, population, lpValue, zonePower);
      return;
    }
  }

  // Occasionally assess and perhaps modify the tile
  if (random.Random.getChance(7)) {
    var locationScore = trafficOK === Traffic.NO_ROAD_FOUND ? -3000 :
                        simData.blockMaps.cityCentreDistScoreMap.worldGet(x, y);
    var zoneScore = simData.valves.comValve + locationScore;

    // Unpowered zones should of course be penalized
    if (!zonePower)
      zoneScore = -500;

    // The commercial demand valve has range -1500 to 1500, so taking into account the "no traffic" and
    // "no power" modifiers above, zoneScore must lie in the range -5064 - 1564. (The comRateMap, which scores
    // commercial neighbourhoods based on their distance from the city centre, has range -64 to 64).

    // First: observe that if there are no roads we will never take this branch, as zoneScore will be <= -3000.
    // Given the comment above about ranges for zoneScore, zoneScore - 26380, will be in the range -26729 to -24816.
    // getRandom16() has a range of 65536 possible numbers, in the range -32768 to 32767.
    // Of those, 9.2% will always be below zoneScore and hence will always take this branch and trigger zone growth.
    // 87.8% of them are above -24816, so nearly 88% of the time, we will never take this branch.
    // Thus, there's approximately a 3% chance that the value will be in the range, and we *might* grow.
    // This has the nice effect of not preventing an individual unit from growing even if overall demand has collapsed
    // (the business itself might still be growing.
    if (zonePower && zoneScore > -350 && (zoneScore - 26380) > random.Random.getRandom16Signed()) {
      lpValue = ZoneUtils.getLandPollutionValue(simData.blockMaps, x, y);
      growZone(map, x, y, simData.blockMaps, population, lpValue, zonePower);
      return;
    }

    // Again, given the  above, zoneScore + 26380 must lie in the range 21316 - 27944.
    // There is a 7.3% chance of getRandom16() always yielding a number > 27994 which would take this branch.
    // There is a 82.5% chance of the number being below 21316 thus never triggering this branch, which leaves a
    // 10.1% chance of this branch being conditional on zoneScore.
    if (zoneScore < 350 && (zoneScore + 26380) < random.Random.getRandom16Signed()) {
      lpValue = ZoneUtils.getLandPollutionValue(simData.blockMaps, x, y);
      degradeZone(map, x, y, simData.blockMaps, population, lpValue, zonePower);
    }
  }
};


var Commercial = {
  registerHandlers: function(mapScanner, repairManager) {
    mapScanner.addAction(TileUtils.isCommercialZone, commercialFound);
  },
  getZonePopulation: getZonePopulation
};




;// ./src/industrial.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */








// There are 8 types of industrial zone aside from the empty zone. They are categorized by population and value.
// There are 4 levels of population (1-4), and 2 levels of value.
//
// Population level 1/low value corresponds to the 9 tiles starting at tile 621. This is followed by the tiles
// for population level 2/low value, and so on.


// Given the centre of an industrial zone, compute it's population level (a number in the range 0-4)
var industrial_getZonePopulation = function(map, x, y, tileValue) {
  if (tileValue === src_tileValues.INDCLR)
    return 0;

  return Math.floor((tileValue - src_tileValues.IZB) / 9) % 4 + 1;
};


// Takes a map and coordinates, a population category in the range 1-4, a value category in the range 0-1, and places
// the appropriate industrial zone on the map
var placeIndustrial = function(map, x, y, populationCategory, valueCategory, zonePower) {
  var centreTile = ((valueCategory * 4) + populationCategory) * 9 + src_tileValues.IZB;
  ZoneUtils.putZone(map, x, y, centreTile, zonePower);
};


var industrial_growZone = function(map, x, y, blockMaps, population, valueCategory, zonePower) {
  // Switch to the next category of zone
  if (population < 4) {
    placeIndustrial(map, x, y, population, valueCategory, zonePower);
    ZoneUtils.incRateOfGrowth(blockMaps, x, y, 8);
  }
};


var industrial_degradeZone = function(map, x, y, blockMaps, populationCategory, valueCategory, zonePower) {
  // Note that we special case empty zones here, rather than having to check population value on every
  // call to placeIndustrial (which we anticipate will be called more often)
  if (populationCategory > 1)
    placeIndustrial(map, x, y, populationCategory - 2, valueCategory, zonePower);
  else
    ZoneUtils.putZone(map, x, y, src_tileValues.INDCLR, zonePower);

  ZoneUtils.incRateOfGrowth(blockMaps, x, y, -8);
};


var animated = [true, false, true, true, false, false, true, true];
var xDelta = [-1, 0, 1, 0, 0, 0, 0, 1];
var yDelta = [-1, 0, -1, -1, 0, 0, -1, -1];


// Takes a map and coordinates, the tile value of the centre of the zone, and a boolean indicating whether
// the zone has power, and sets or unsets the animation bit in the appropriate part of the zone
var setAnimation = function(map, x, y, tileValue, isPowered) {
  // The empty zone is not animated
  if (tileValue < src_tileValues.IZB)
    return;

  // There are only 8 different types of populated industrial zones. We always have tileValue - IZB < 8x9 (=72),
  // so (tileValue - IZB) >> 3 effectively divides (tileValue - IZB) by 9, forcing into the range 0-7
  var i = (tileValue - src_tileValues.IZB) >> 3;

  // If the tile is animated and powered we set animated, conductive, combustible. Otherwise we set burnable and
  // conductive.
  if (animated[i] && isPowered) {
    map.addTileFlags(x + xDelta[i], y + yDelta[i], src_tileFlags.ASCBIT);
  } else {
    map.addTileFlags(x + xDelta[i], y + yDelta[i], src_tileFlags.BNCNBIT);

    // Ensure we drop the animation bit if we've only recently lost power
    map.removeTileFlags(x + xDelta[i], y + yDelta[i], src_tileFlags.ANIMBIT);
  }
};


// Called by the map scanner when it finds the centre of an industrial zone
var industrialFound = function(map, x, y, simData) {
  // Notify the census
  simData.census.indZonePop += 1;

  // Calculate the population level for this tile, and add to census
  var tileValue = map.getTileValue(x, y);
  var population = industrial_getZonePopulation(map, x, y, tileValue);
  simData.census.indPop += population;

  // Set animation bit if appropriate
  var zonePower = map.getTile(x, y).isPowered();
  setAnimation(map, x, y, tileValue, zonePower);

  // Occasionally check to see if the zone is connected to the transport network (the chance of this happening
  // increases as the population increases). Growth naturally stalls if workers cannot reach the factories.
  // Note in particular, we will never take this branch if the zone is empty.
  var trafficOK = Traffic.ROUTE_FOUND;
  if (population > random.Random.getRandom(5)) {
    // Try to find a route from here to a residential zone
    trafficOK = simData.trafficManager.makeTraffic(x, y, simData.blockMaps, TileUtils.isResidential);

    // Trigger outward migration if not connected to road network (unless the zone is already empty)
    if (trafficOK === Traffic.NO_ROAD_FOUND) {
      var newValue = random.Random.getRandom16() & 1;
      industrial_degradeZone(map, x, y, simData.blockMaps, population, newValue, zonePower);
      return;
    }
  }

  // Occasionally assess and perhaps modify the tile
  if (random.Random.getChance(7)) {
    var zoneScore = simData.valves.indValve + (trafficOK === Traffic.NO_ROAD_FOUND ? -1000 : 0);

    // Unpowered zones should of course be penalized
    if (!zonePower)
      zoneScore = -500;

    // The industrial demand valve has range -1500 to 1500, so taking into account the "no traffic" and
    // "no power" modifiers above, zoneScore must lie in the range -3000 - 1500

    // First: observe that if there are no roads we will never take this branch, as zoneScore will be <= -1000.
    // Given the comment above about ranges for zoneScore, zoneScore - 26380, will be in the range -26729 to -24880.
    // getRandom16() has a range of 65536 possible numbers, in the range -32768 to 32767.
    // Of those, 9.2% will always be below zoneScore and hence will always take this branch and trigger zone growth.
    // 87.9% of them are above -24880, so nearly 88% of the time, we will never take this branch.
    // Thus, there's approximately a 2.9% chance that the value will be in the range, and we *might* grow.
    // This has the nice effect of not preventing an individual unit from growing even if overall demand has collapsed
    // (the business itself might still be growing.
    if (zoneScore > -350 && (zoneScore - 26380) > random.Random.getRandom16Signed()) {
      industrial_growZone(map, x, y, simData.blockMaps, population, random.Random.getRandom16() & 1, zonePower);
      return;
    }

    // Again, given the  above, zoneScore + 26380 must lie in the range 23380 - 27880.
    // There is a 7.4% chance of getRandom16() always yielding a number > 27880 which would take this branch.
    // There is a 85.6% chance of the number being below 23380 thus never triggering this branch, which leaves a
    // 9% chance of this branch being conditional on zoneScore.
    if (zoneScore < 350 && (zoneScore + 26380) < random.Random.getRandom16Signed())
      industrial_degradeZone(map, x, y, simData.blockMaps, population, random.Random.getRandom16() & 1, zonePower);
  }
};


var Industrial = {
  registerHandlers: function(mapScanner, repairManager) {
    mapScanner.addAction(TileUtils.isIndustrialZone, industrialFound);
  },
  getZonePopulation: industrial_getZonePopulation
};




;// ./src/residential.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */










// Residential tiles have 'populations' of 16, 24, 32 or 40, and value from 0 to 3. The tiles are laid out in
// increasing order of land value, cycling through each population value
var placeResidential = function(map, x, y, population, lpValue, zonePower) {
  var centreTile = ((lpValue * 4) + population) * 9 + src_tileValues.RZB;
  ZoneUtils.putZone(map, x, y, centreTile, zonePower);
};


// Look for housing in the adjacent 8 tiles
var getFreeZonePopulation = function(map, x, y, tileValue) {
  var count = 0;
  for (var xx = x - 1; xx <= x + 1; xx++) {
    for (var yy = y - 1; yy <= y + 1; yy++) {
      if (xx === x && yy === y) continue;
      tileValue = map.getTileValue(xx, yy);
      if (tileValue >= src_tileValues.LHTHR && tileValue <= src_tileValues.HHTHR)
        count += 1;
    }
  }

  return count;
};


var residential_getZonePopulation = function(map, x, y, tileValue) {
  if (tileValue instanceof src_tile.Tile)
    tileValue = tile.getValue();

  if (tileValue === src_tileValues.FREEZ)
    return getFreeZonePopulation(map, x, y, tileValue);

  var populationIndex = Math.floor((tileValue - src_tileValues.RZB) / 9) % 4 + 1;
  return populationIndex * 8 + 16;
};


// Assess a tile for suitability for a house. Prefers tiles near roads
var evalLot = function(map, x, y) {
  var xDelta = [0, 1, 0, -1];
  var yDelta = [-1, 0, 1, 0];

  if (!map.testBounds(x, y))
    return -1;

  var tileValue = map.getTileValue(x, y);
  if (tileValue < src_tileValues.RESBASE || tileValue > src_tileValues.RESBASE + 8)
    return -1;

  var score = 1;
  for (var i = 0; i < 4; i++) {
    var edgeX = x + xDelta[i];
    var edgeY = y + yDelta[i];

    if (edgeX < 0 || edgeX >= map.width || edgeY < 0 || edgeY >= map.height)
      continue;

    tileValue = map.getTileValue(edgeX, edgeY);
    if (tileValue !== src_tileValues.DIRT && tileValue <= src_tileValues.LASTROAD)
      score += 1;
  }

  return score;
};


var buildHouse = function(map, x, y, lpValue) {
  var best = 0;
  var bestScore = 0;

  //  Deliberately ordered so that the centre tile is at index 0
  var xDelta = [0, -1, 0, 1, -1, 1, -1, 0, 1];
  var yDelta = [0, -1, -1, -1, 0, 0, 1, 1, 1];

  for (var i = 0; i < 9; i++) {
    var xx = x + xDelta[i];
    var yy = y + yDelta[i];

    var score = evalLot(map, xx, yy);
    if (score > bestScore) {
      bestScore = score;
      best = i;
    } else if (score === bestScore && random.Random.getChance(7)) {
      // Ensures we don't always select the same position when we
      // have a choice
      best = i;
    }
  }

  if (best > 0 && map.testBounds(x + xDelta[best], y + yDelta[best]))
    map.setTile(x + xDelta[best], y + yDelta[best],
              src_tileValues.HOUSE + random.Random.getRandom(2) + lpValue * 3, src_tileFlags.BLBNCNBIT);
};


var residential_growZone = function(map, x, y, blockMaps, population, lpValue, zonePower) {
  var pollution = blockMaps.pollutionDensityMap.worldGet(x, y);

  // Cough! Too polluted! No-one wants to move here!
  if (pollution > 128)
    return;

  var tileValue = map.getTileValue(x, y);

  if (tileValue === src_tileValues.FREEZ) {
    if (population < 8) {
      // Zone capacity not yet reached: build another house
      buildHouse(map, x, y, lpValue);
      ZoneUtils.incRateOfGrowth(blockMaps, x, y, 1);
    } else if (blockMaps.populationDensityMap.worldGet(x, y) > 64) {
      // There is local demand for higher density housing
      placeResidential(map, x, y, 0, lpValue, zonePower);
      ZoneUtils.incRateOfGrowth(blockMaps, x, y, 8);
    }

    return;
  }

  if (population < 40) {
    // Zone population not yet maxed out
    placeResidential(map, x, y, Math.floor(population / 8) - 1, lpValue, zonePower);
    ZoneUtils.incRateOfGrowth(blockMaps, x, y, 8);
  }
};


var freeZone = [0, 3, 6, 1, 4, 7, 2, 5, 8];

var residential_degradeZone = function(map, x, y, blockMaps, population, lpValue, zonePower) {
  var xx, yy;
  if (population === 0)
    return;

  if (population > 16) {
    // Degrade to a lower density block
    placeResidential(map, x, y, Math.floor((population - 24) / 8), lpValue, zonePower);
    ZoneUtils.incRateOfGrowth(blockMaps, x, y, -8);
    return;
  }

  if (population === 16) {
    // Already at lowest density: degrade to 8 individual houses
    map.setTile(x, y, src_tileValues.FREEZ, src_tileFlags.BLBNCNBIT | src_tileFlags.ZONEBIT);

    for (yy = y - 1; yy <= y + 1; yy++) {
      for (xx = x - 1; xx <= x + 1; xx++) {
        if (xx === x && yy === y) continue;
        map.setTile(x, y, src_tileValues.LHTHR + lpValue + random.Random.getRandom(2), src_tileFlags.BLBNCNBIT);
      }
    }

    ZoneUtils.incRateOfGrowth(blockMaps, x, y, -8);
    return;
  }

  // Already down to individual houses. Remove one
  var i = 0;
  ZoneUtils.incRateOfGrowth(blockMaps, x, y, -1);

  for (xx = x - 1; xx <= x + 1; xx++) {
    for (yy = y - 1; yy <= y + 1; yy++, i++) {
      var currentValue = map.getTileValue(xx, yy);
      if (currentValue >= src_tileValues.LHTHR && currentValue <= src_tileValues.HHTHR) {
        // We've found a house. Replace it with the normal free zone tile
        map.setTile(xx, yy, freeZone[i] + src_tileValues.RESBASE, src_tileFlags.BLBNCNBIT);
        return;
      }
    }
  }
};


// Returns a score for the zone in the range -3000 - 3000
var evalResidential = function(blockMaps, x, y, traffic) {
  if (traffic === Traffic.NO_ROAD_FOUND)
    return -3000;

  var landValue = blockMaps.landValueMap.worldGet(x, y);
  landValue -= blockMaps.pollutionDensityMap.worldGet(x, y);

  if (landValue < 0)
    landValue = 0;
  else
    landValue = Math.min(landValue * 32, 6000);

  return landValue - 3000;
};


var residentialFound = function(map, x, y, simData) {
  // If we choose to grow this zone, we will fill it with an index in the range 0-3 reflecting the land value and
  // pollution scores (higher is better). This is then used to select the variant to build
  var lpValue;

  // Notify the census
  simData.census.resZonePop += 1;

  // Also, notify the census of our population
  var tileValue = map.getTileValue(x, y);
  var population = residential_getZonePopulation(map, x, y, tileValue);
  simData.census.resPop += population;

  var zonePower = map.getTile(x, y).isPowered();

  var trafficOK = Traffic.ROUTE_FOUND;

  // Occasionally check to see if the zone is connected to the road network. The chance of this happening increases
  // as the zone's population increases. Note: we will never execute this conditional if the zone is empty, as zero
  // will never be be bigger than any of the values Random will generate
  if (population > random.Random.getRandom(35)) {
    // Is there a route from this zone to a commercial zone?
    trafficOK = simData.trafficManager.makeTraffic(x, y, simData.blockMaps, TileUtils.isCommercial);

    // If we're not connected to the road network, then going shopping will be a pain. Move out.
    if (trafficOK === Traffic.NO_ROAD_FOUND) {
      lpValue = ZoneUtils.getLandPollutionValue(simData.blockMaps, x, y);
      residential_degradeZone(map, x, y, simData.blockMaps, population, lpValue, zonePower);
      return;
    }
  }

  // Sometimes we will randomly choose to assess this block. However, always assess it if it's empty or contains only
  // single houses.
  if (tileValue === src_tileValues.FREEZ || random.Random.getChance(7)) {
    // First, score the individual zone. This is a value in the range -3000 to 3000
    // Then take into account global demand for housing.
    var locationScore = evalResidential(simData.blockMaps, x, y, trafficOK);
    var zoneScore = simData.valves.resValve + locationScore;

    // Naturally unpowered zones should be penalized
    if (!zonePower)
      zoneScore = -500;

    // The residential demand valve has range -2000 to 2000, so taking into account the "no traffic" and
    // "no power" modifiers above, zoneScore must lie in the range -5500 - 5000.

    // Now, observe that if there are no roads we will never take this branch, as zoneScore will equal -3000.
    // Given the comment above about ranges for zoneScore, zoneScore - 26380, will be in the range -26729 to -20880.
    // getRandom16() has a range of 65536 possible numbers, in the range -32768 to 32767.
    // Of those, 9.2% will always be below zoneScore and hence will always take this branch and trigger zone growth.
    // 81.8% of them are above -20880, so nearly 82% of the time, we will never take this branch.
    // Thus, there's approximately a 9% chance that the value will be in the range, and we *might* grow.
    if (zoneScore > -350 && (zoneScore - 26380) > random.Random.getRandom16Signed()) {
      // If this zone is empty, and residential demand is strong, we might make a hospital
      if (population === 0 && random.Random.getChance(3)) {
        makeHospital(map, x, y, simData, zonePower);
        return;
      }

      // Get an index in the range 0-3 scoring the land desirability and pollution, and grow the zone to the next
      // population rank
      lpValue = ZoneUtils.getLandPollutionValue(simData.blockMaps, x, y);
      residential_growZone(map, x, y, simData.blockMaps, population, lpValue, zonePower);
      return;
    }

    // Again, given the above, zoneScore + 26380 must lie in the range 20880 - 26030.
    // There is a 10.2% chance of getRandom16() always yielding a number > 27994 which would take this branch.
    // There is a 89.7% chance of the number being below 20880 thus never triggering this branch, which leaves a
    // 0.1% chance of this branch being conditional on zoneScore.
    if (zoneScore < 350 && (zoneScore + 26380) < random.Random.getRandom16Signed()) {
      // Get an index in the range 0-3 scoring the land desirability and pollution, and degrade to the next
      // lower ranked zone
      lpValue = ZoneUtils.getLandPollutionValue(simData.blockMaps, x, y);
      residential_degradeZone(map, x, y, simData.blockMaps, population, lpValue, zonePower);
    }
  }
};


var makeHospital = function(map, x, y, simData, zonePower) {
  // We only build a hospital if the population requires it
  if (simData.census.needHospital > 0) {
    ZoneUtils.putZone(map, x, y, src_tileValues.HOSPITAL, zonePower);
    simData.census.needHospital = 0;
    return;
  }
};


var hospitalFound = function(map, x, y, simData) {
  simData.census.hospitalPop += 1;

  // Degrade to an empty zone if a hospital is no longer sustainable
  if (simData.census.needHospital === -1) {
    if (random.Random.getRandom(20) === 0)
      ZoneUtils.putZone(map, x, y, src_tileValues.FREEZ, map.getTile(x, y).isPowered());
  }
};


var Residential = {
  registerHandlers: function(mapScanner, repairManager) {
    mapScanner.addAction(TileUtils.isResidentialZone, residentialFound);
    mapScanner.addAction(src_tileValues.HOSPITAL, hospitalFound);
    repairManager.addAction(src_tileValues.HOSPITAL, 15, 3);
  },
  getZonePopulation: residential_getZonePopulation
};




;// ./src/blockMapUtils.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */









// Smoothing styles for map smoothing
var SMOOTH_NEIGHBOURS_THEN_BLOCK = 0;
var SMOOTH_ALL_THEN_CLAMP = 1;


// Smooth the map src into dest. The way in which the map is smoothed depends on the value of smoothStyle.
// The meanings are as follows:
//
// SMOOTH_NEIGHBOURS_THEN_BLOCK
// ============================
// For each square in src, sum the values of its immediate neighbours, and take the average, then take the average of
// that result and the square's value. This result is the new value of the square in dest.
//
// SMOOTH_ALL_THEN_CLAMP
// =====================
// For each square in src, sum the values of that square and it's four immediate neighbours, and take an average
// rounding down. Clamp the resulting value in the range 0-255. This clamped value is the square's new value in dest.
var smoothMap = function(src, dest, smoothStyle) {
  for (var x = 0, width = src.width; x < width; x++) {
    for (var y = 0, height = src.height; y < height; y++) {
      var edges = 0;

      if (x > 0)
        edges += src.get(x - 1, y);

      if (x < src.width - 1)
        edges += src.get(x + 1, y);

      if (y > 0)
        edges += src.get(x, y - 1);

      if (y < src.height - 1)
        edges += src.get(x, y + 1);

      if (smoothStyle === SMOOTH_NEIGHBOURS_THEN_BLOCK) {
        edges = src.get(x, y) + Math.floor(edges / 4);
        dest.set(x, y, Math.floor(edges/2));
      } else {
        edges = (edges + src.get(x, y)) >> 2;
        if (edges > 255)
          edges = 255;
        dest.set(x, y, edges);
      }
    }
  }
};


// Over time, the rate of growth of a neighbourhood should trend towards zero (stable)
var neutraliseRateOfGrowthMap = function(blockMaps) {
  var rateOfGrowthMap = blockMaps.rateOfGrowthMap;
  for (var x = 0, width = rateOfGrowthMap.width; x < width; x++) {
    for (var y = 0, height = rateOfGrowthMap.height; y < height; y++) {
      var rate = rateOfGrowthMap.get(x, y);
      if (rate === 0)
        continue;

      if (rate > 0)
        rate--;
      else
        rate++;

      rate = MiscUtils.clamp(rate, -200, 200);
      rateOfGrowthMap.set(x, y, rate);
    }
  }
};


// Over time, traffic density should ease.
var neutraliseTrafficMap = function(blockMaps) {
  var trafficDensityMap = blockMaps.trafficDensityMap;

  for (var x = 0, width = trafficDensityMap.width; x < width; x++) {
    for (var y = 0, height = trafficDensityMap.height; y < height; y++) {
      var trafficDensity = trafficDensityMap.get(x, y);
      if (trafficDensity === 0)
        continue;

      if (trafficDensity <= 24)
        trafficDensity = 0;
      else if (trafficDensity > 200)
        trafficDensity = trafficDensity - 34;
      else
        trafficDensity = trafficDensity - 24;

      trafficDensityMap.set(x, y, trafficDensity);
    }
  }
};


// Given a tileValue, score it on the pollution it generates, in the range 0-255
var getPollutionValue = function(tileValue) {
  if (tileValue < src_tileValues.POWERBASE) {
    // Roads, fires and radiation lie below POWERBASE

    // Heavy traffic is bad
    if (tileValue >= src_tileValues.HTRFBASE)
      return 75;

    // Low traffic not so much
    if (tileValue >= src_tileValues.LTRFBASE)
      return 50;

    if (tileValue <  src_tileValues.ROADBASE) {
      // Fire = carbon monoxide = a bad score for you
      if (tileValue > src_tileValues.FIREBASE)
        return 90;

      // Radiation. Top of the charts.
      if (tileValue >= src_tileValues.RADTILE)
        return 255;
    }

    // All other types of ground are pure.
    return 0;
  }

  // If we've reached this point, we're classifying some form of zone tile

  // Residential and commercial zones don't pollute
  if (tileValue <= src_tileValues.LASTIND)
    return 0;

  // Industrial zones, however...
  if (tileValue < src_tileValues.PORTBASE)
    return 50;

  // Coal power plants are bad
  if (tileValue <= src_tileValues.LASTPOWERPLANT)
      return 100;

  return 0;
};


// Compute the Manhattan distance of the given point from the city centre, and force into the range 0-64
var getCityCentreDistance = function(map, x, y) {
  var xDis, yDis;

  if (x > map.cityCentreX)
    xDis = x - map.cityCentreX;
  else
    xDis = map.cityCentreX - x;

  if (y > map.cityCentreY)
    yDis = y - map.cityCentreY;
  else
    yDis = map.cityCentreY - y;

  return Math.min(xDis + yDis, 64);
};


// This monster function fills up the landValueMap, the terrainDensityMap and the pollutionDensityMap based
// on values found by iterating over the map.
//
// Factors that affect land value:
//   * Distance from the city centre
//   * High crime
//   * High pollution
//   * Proximity to undeveloped terrain (who doesn't love a good view?)
//
// Pollution is completely determined by the tile types in the block
var pollutionTerrainLandValueScan = function(map, census, blockMaps) {
  // We record raw pollution readings for each tile into tempMap1, and then use tempMap2 and tempMap1 to smooth
  // out the pollution in order to construct the new values for the populationDensityMap
  var tempMap1 = blockMaps.tempMap1;
  var tempMap2 = blockMaps.tempMap2;

  // tempMap3 will be used to record raw terrain information, i.e. if the the land is developed. This will be
  // smoothed in to terrainDensityMap later
  var tempMap3 = blockMaps.tempMap3;
  tempMap3.clear();

  var landValueMap = blockMaps.landValueMap;
  var terrainDensityMap = blockMaps.terrainDensityMap;
  var pollutionDensityMap = blockMaps.pollutionDensityMap;
  var crimeRateMap = blockMaps.crimeRateMap;

  var x, y, width, height;

  var totalLandValue = 0;
  var developedTileCount = 0;

  for (x = 0, width = landValueMap.width; x < width; x++) {
    for (y = 0, height = landValueMap.height; y < height; y++) {
      var pollutionLevel = 0;
      var developed = false;

      // The land value map has a chunk size of 2
      var worldX = x * 2;
      var worldY = y * 2;

      for (var mapX = worldX; mapX <= worldX + 1; mapX++) {
        for (var mapY = worldY; mapY <= worldY + 1; mapY++) {
          var tileValue = map.getTileValue(mapX, mapY);

          if (tileValue === src_tileValues.DIRT)
            continue;

          if (tileValue < src_tileValues.RUBBLE) {
            // Undeveloped land: record in tempMap3. Each undeveloped piece of land scores 15.
            // tempMap3 has a chunk size of 4, so each square in tempMap3 will ultimately contain a
            // maximum value of 240
            var terrainValue = tempMap3.worldGet(mapX, mapY);
            tempMap3.worldSet(mapX, mapY, terrainValue + 15);
            continue;
          }

          pollutionLevel += getPollutionValue(tileValue);
          if (tileValue >= src_tileValues.ROADBASE)
            developed = true;
        }
      }

      // Clamp pollution in range 0-255 (at the moment it's range is 0-1020) and record it for later.
      pollutionLevel = Math.min(pollutionLevel, 255);
      tempMap1.set(x, y, pollutionLevel);

      if (developed) {
        // getCityCentreDistance returns a score in the range 0-64, so, after shifting, landValue will be in
        // range 8-136
        var landValue = 34 - Math.floor(getCityCentreDistance(map, worldX, worldY) / 2);
        landValue = landValue << 2;

        // Land in the same neighbourhood as unspoiled land is more valuable...
        landValue += terrainDensityMap.get(x >> 1, y >> 1);

        // ... and polluted land obviously is less valuable
        landValue -= pollutionDensityMap.get(x, y);

        // ... getting mugged won't help either
        if (crimeRateMap.get(x, y) > 190)
          landValue -= 20;

        // Clamp in range 1-250 (0 represents undeveloped land)
        landValue = MiscUtils.clamp(landValue, 1, 250);
        landValueMap.set(x, y, landValue);

        totalLandValue += landValue;
        developedTileCount++;
      } else {
        landValueMap.set(x, y, 0);
      }
    }
  }

  if (developedTileCount > 0)
    census.landValueAverage = Math.floor(totalLandValue / developedTileCount);
  else
    census.landValueAverage = 0;
    
  // Smooth the pollution map twice
  smoothMap(tempMap1, tempMap2, SMOOTH_ALL_THEN_CLAMP);
  smoothMap(tempMap2, tempMap1, SMOOTH_ALL_THEN_CLAMP);

  var maxPollution = 0;
  var pollutedTileCount = 0;
  var totalPollution = 0;

  // We iterate over the now-smoothed pollution map rather than using the block map's copy routines
  // so that we can compute the average and total pollution en-route
  for (x = 0, width = map.width; x < width; x += pollutionDensityMap.blockSize) {
    for (y = 0, height = map.height; y < height; y += pollutionDensityMap.blockSize)  {
      // Copy the values into pollutionDensityMap
      var pollution = tempMap1.worldGet(x, y);
      pollutionDensityMap.worldSet(x, y, pollution);

      if (pollution !== 0) {
        pollutedTileCount++;
        totalPollution += pollution;

        // Note the most polluted location: any monsters will be drawn there (randomly choosing one
        // if we have multiple competitors for most polluted)
        if (pollution > maxPollution || (pollution === maxPollution && random.Random.getChance(3))) {
          maxPollution = pollution;
          map.pollutionMaxX = x;
          map.pollutionMaxY = y;
        }
      }
    }
  }

  if (pollutedTileCount)
    census.pollutionAverage = Math.floor(totalPollution / pollutedTileCount);
  else
    census.pollutionAverage = 0;

  smoothMap(tempMap3, terrainDensityMap, SMOOTH_NEIGHBOURS_THEN_BLOCK);
};


// Computes the coverage radius of police stations, and scores each neighbourhood in the map on its crime rate.
// Factors that attract crime are:
//    * The zone has a low value
//    * The zone is a slum
//    * The zone is far away from those pesky police
var crimeScan = function(census, blockMaps) {
  var policeStationMap = blockMaps.policeStationMap;
  var policeStationEffectMap = blockMaps.policeStationEffectMap;
  var crimeRateMap = blockMaps.crimeRateMap;
  var landValueMap = blockMaps.landValueMap;
  var populationDensityMap = blockMaps.populationDensityMap;

  smoothMap(policeStationMap, policeStationEffectMap, SMOOTH_NEIGHBOURS_THEN_BLOCK);
  smoothMap(policeStationEffectMap, policeStationMap, SMOOTH_NEIGHBOURS_THEN_BLOCK);
  smoothMap(policeStationMap, policeStationEffectMap, SMOOTH_NEIGHBOURS_THEN_BLOCK);

  var totalCrime = 0;
  var crimeZoneCount = 0;

  // Scan the map, looking for developed land, as it can attract crime.
  for (var x = 0, width = crimeRateMap.mapWidth, blockSize = crimeRateMap.blockSize; x < width; x += blockSize) {
    for (var y = 0, height = crimeRateMap.mapHeight, b; y < height; y += blockSize) {
      // Remember: landValueMap values are in the range 0-250
      var value = landValueMap.worldGet(x, y);

      if (value > 0) {
        crimeZoneCount += 1;

        // Force value in the range -122 to 128. Lower valued pieces of land attract more crime.
        value = 128 - value;

        // Add population density (a value between 0 and 510). value now lies in range -260 - 382.
        // Denser areas attract more crime.
        value += populationDensityMap.worldGet(x, y);

        // Clamp in range -260 to 300
        value = Math.min(value, 300);

        // If the police are nearby, there's no point committing the crime of the century
        value -= policeStationMap.worldGet(x, y);

        // Force in to range 0-250
        value = MiscUtils.clamp(value, 0, 250);

        crimeRateMap.worldSet(x, y, value);
        totalCrime += value;
      } else {
        crimeRateMap.worldSet(x, y, 0);
      }
    }
  }

  if (crimeZoneCount > 0)
      census.crimeAverage = Math.floor(totalCrime / crimeZoneCount);
  else
      census.crimeAverage = 0;
};


// Iterate over the map, and score each neighbourhood on its distance from the city centre. Scores are in the range
// -64 to 64. This affects the growth of commercial zones within that neighbourhood.
var fillCityCentreDistScoreMap = function(map, blockMaps) {
  var cityCentreDistScoreMap = blockMaps.cityCentreDistScoreMap;

  for (var x = 0, width = cityCentreDistScoreMap.width; x < width; x++) {
    for (var y = 0, height = cityCentreDistScoreMap.height; y < height; y++) {
      // First, we compute the Manhattan distance of the top-left hand corner of the neighbourhood to the city centre
      // and half that value. This leaves us a value in the range 0 - 32
      var value = Math.floor(getCityCentreDistance(map, x * 8, y * 8) / 2);
      // Now, we scale up by a factor of 4. We're in the range 0 - 128
      value = value * 4;
      // And finally, subtract from 64, leaving us a score in the range -64 to 64
      value = 64 - value;
      cityCentreDistScoreMap.set(x, y, value);
    }
  }
};


// Dispatch to the correct zone type to get the population value for that zone
var getPopulationDensity = function(map, x, y, tile) {
  if (tile < src_tileValues.COMBASE)
    return Residential.getZonePopulation(map, x, y, tile);

  if (tile < src_tileValues.INDBASE)
    return Commercial.getZonePopulation(map, x, y, tile) * 8;

  if (tile < src_tileValues.PORTBASE)
    return Industrial.getZonePopulation(map, x, y, tile) * 8;

  return 0;
};


// Iterate over the map, examining each zone for population. We then smooth the results into a population density
// map, which is used when deciding to grow residential zones. At the same time, we also note the most populous area
// (in terms of zones) to calculate our city centre. Finally, we score each area of the map on its distance from the
// city centre.
var populationDensityScan = function(map, blockMaps) {
  // We will build the initial unsmoothed map in tempMap1, and smooth it in to tempMap2
  var tempMap1 = blockMaps.tempMap1;
  var tempMap2 = blockMaps.tempMap2;
  var populationDensityMap = blockMaps.populationDensityMap;

  // We will sum all the coordinates that contain zones into xTot and yTot. They are used in our city centre
  // heuristic.
  var xTot = 0;
  var yTot = 0;
  var zoneTotal = 0;
    
  tempMap1.clear();

  for (var x = 0, width = map.width; x < width; x++) {
    for (var y = 0, height = map.height; y < height; y++) {
      var tile = map.getTile(x, y);
      if (tile.isZone()) {
        var tileValue = tile.getValue();

        // Ask the zone to calculate its population, scale it up, then clamp in the range 0-254
        var population = getPopulationDensity(map, x, y, tileValue) * 8;
        population = Math.min(population, 254);

        // The block size of population density is 2x2, so there can only be 1 zone per block
        tempMap1.worldSet(x, y, population);

        xTot += x;
        yTot += y;
        zoneTotal++;
      }
    }
  }

  smoothMap(tempMap1, tempMap2, SMOOTH_ALL_THEN_CLAMP);
  smoothMap(tempMap2, tempMap1, SMOOTH_ALL_THEN_CLAMP);
  smoothMap(tempMap1, tempMap2, SMOOTH_ALL_THEN_CLAMP);
  blockMaps.populationDensityMap.copyFrom(tempMap2, function(x) {return x * 2;});

  // XXX This follows the original Micropolis source, but it feels weird to me that we score the entire map
  // based on city centre proximity, and then potentially move the city centre. I think these should be
  // swapped.
  fillCityCentreDistScoreMap(map, blockMaps);

  // Compute new city centre
  if (zoneTotal > 0) {
    map.cityCentreX = Math.floor(xTot / zoneTotal);
    map.cityCentreY = Math.floor(yTot / zoneTotal);
  } else {
    map.cityCentreX = Math.floor(map.width / 2);
    map.cityCentreY = Math.floor(map.height / 2);
  }
};


// Compute the radius of coverage for the firestations found during the map scan
var fireAnalysis = function(blockMaps) {
  var fireStationMap = blockMaps.fireStationMap;
  var fireStationEffectMap = blockMaps.fireStationEffectMap;

  smoothMap(fireStationMap, fireStationEffectMap, SMOOTH_NEIGHBOURS_THEN_BLOCK);
  smoothMap(fireStationEffectMap, fireStationMap, SMOOTH_NEIGHBOURS_THEN_BLOCK);
  smoothMap(fireStationMap, fireStationEffectMap, SMOOTH_NEIGHBOURS_THEN_BLOCK);
};


var BlockMapUtils = {
  crimeScan: crimeScan,
  fireAnalysis: fireAnalysis,
  neutraliseRateOfGrowthMap: neutraliseRateOfGrowthMap,
  neutraliseTrafficMap: neutraliseTrafficMap,
  pollutionTerrainLandValueScan: pollutionTerrainLandValueScan,
  populationDensityScan: populationDensityScan
};




;// ./src/budget.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */





// Cost of maintaining 1 police station
var policeMaintenanceCost = 100;

// Cost of maintaining 1 fire station
var fireMaintenanceCost = 100;

// Cost of maintaining 1 road tile
var roadMaintenanceCost = 1;

// Cost of maintaining 1 rail tile
var railMaintenanceCost = 2;


var Budget = EventEmitter(function() {
  Object.defineProperties(this,
   {MAX_ROAD_EFFECT: MiscUtils.makeConstantDescriptor(32),
    MAX_POLICESTATION_EFFECT: MiscUtils.makeConstantDescriptor(1000),
    MAX_FIRESTATION_EFFECT:  MiscUtils.makeConstantDescriptor(1000)});

  this.roadEffect = this.MAX_ROAD_EFFECT;
  this.policeEffect = this.MAX_POLICESTATION_EFFECT;
  this.fireEffect = this.MAX_FIRESTATION_EFFECT;
  this.totalFunds = 0;
  this.cityTax = 7;
  this.cashFlow = 0;
  this.taxFund = 0;

  // These values denote how much money is required to fully maintain the relevant services
  this.roadMaintenanceBudget = 0;
  this.fireMaintenanceBudget = 0;
  this.policeMaintenanceBudget = 0;

  // Percentage of budget used
  this.roadPercent = 1;
  this.firePercent = 1;
  this.policePercent = 1;

  // Cash value of spending. Should equal Math.round(_MaintenanceBudget * _Percent)
  this.roadSpend = 0;
  this.fireSpend = 0;
  this.policeSpend = 0;

  this.awaitingValues = false;
  this.autoBudget = true;
});


var budget_saveProps = ['autoBudget', 'totalFunds', 'policePercent', 'roadPercent', 'firePercent', 'roadSpend',
                 'policeSpend', 'fireSpend', 'roadMaintenanceBudget', 'policeMaintenanceBudget',
                 'fireMaintenanceBudget', 'cityTax', 'roadEffect', 'policeEffect', 'fireEffect'];

Budget.prototype.save = function(saveData) {
  for (var i = 0, l = budget_saveProps.length; i < l; i++)
    saveData[budget_saveProps[i]] = this[budget_saveProps[i]];
};


Budget.prototype.load = function(saveData) {
  for (var i = 0, l = budget_saveProps.length; i < l; i++)
    this[budget_saveProps[i]] = saveData[budget_saveProps[i]];

  this._emitEvent(messages.AUTOBUDGET_CHANGED, this.autoBudget);
  this._emitEvent(messages.FUNDS_CHANGED, this.totalFunds);
};


Budget.prototype.setAutoBudget = function(value) {
  this.autoBudget = value;
  this._emitEvent(messages.AUTOBUDGET_CHANGED, this.autoBudget);
};


var RLevels = [0.7, 0.9, 1.2];
var FLevels = [1.4, 1.2, 0.8];

// Calculates the best possible outcome in terms of funding the various services
// given the player's current funds and tax yield. On entry, roadPercent etc. are
// assumed to contain the desired percentage level, and taxFunds should contain the
// most recent tax collected. On exit, the *Percent members will be updated with what
// we can actually afford to spend. Returns an object containing the amount of cash
// that would be spent on each service.
Budget.prototype._calculateBestPercentages = function() {
  // How much would we be spending based on current percentages?
  // Note: the *Budget items are updated every January by collectTax
  this.roadSpend = Math.round(this.roadMaintenanceBudget * this.roadPercent);
  this.fireSpend = Math.round(this.fireMaintenanceBudget * this.firePercent);
  this.policeSpend = Math.round(this.policeMaintenanceBudget * this.policePercent);
  var total = this.roadSpend + this.fireSpend + this.policeSpend;

  // If we don't have any services on the map, we can bail early
  if (total === 0) {
    this.roadPercent = 1;
    this.firePercent = 1;
    this.policePercent = 1;
    return {road: 1, fire: 1, police: 1};
  }

  // How much are we actually going to spend?
  var roadCost = 0;
  var fireCost = 0;
  var policeCost = 0;

  var cashRemaining = this.totalFunds + this.taxFund;

  // Spending priorities: road, fire, police
  if (cashRemaining >= this.roadSpend)
    roadCost = this.roadSpend;
  else
    roadCost = cashRemaining;
  cashRemaining -= roadCost;

  if (cashRemaining >= this.fireSpend)
    fireCost = this.fireSpend;
  else
    fireCost = cashRemaining;
  cashRemaining -= fireCost;

  if (cashRemaining >= this.policeSpend)
    policeCost = this.policeSpend;
  else
    policeCost = cashRemaining;
  cashRemaining -= policeCost;

  if (this.roadMaintenanceBudget > 0)
    this.roadPercent = (roadCost / this.roadMaintenanceBudget).toPrecision(2) - 0;
  else
    this.roadPercent = 1;

  if (this.fireMaintenanceBudget > 0)
    this.firePercent = (fireCost / this.fireMaintenanceBudget).toPrecision(2) - 0;
  else
    this.firePercent = 1;

  if (this.policeMaintenanceBudget > 0)
    this.policePercent = (policeCost / this.policeMaintenanceBudget).toPrecision(2) - 0;
  else
    this.policePercent = 1;

  return {road: roadCost, police: policeCost, fire: fireCost};
};


// User initiated budget
Budget.prototype.doBudgetWindow = function() {
  return this.doBudgetNow(true);
};


Budget.prototype.doBudgetNow = function(fromWindow) {
  var costs = this._calculateBestPercentages();

  if (!this.autoBudget && !fromWindow) {
    this.autoBudget = false;
    this.awaitingValues = true;
    this._emitEvent(messages.BUDGET_NEEDED);
    return;
  }

  var roadCost = costs.road;
  var policeCost = costs.police;
  var fireCost = costs.fire;
  var totalCost = roadCost + policeCost + fireCost;
  var cashRemaining = this.totalFunds + this.taxFund - totalCost;

  // Autobudget
  if ((cashRemaining > 0 && this.autoBudget) || fromWindow) {
    // Either we were able to fully fund services, or we have just normalised user input. Go ahead and spend.
    this.awaitingValues = false;
    this.doBudgetSpend(roadCost, fireCost, policeCost);
    return;
  }

  // Uh-oh. Not enough money. Make this the user's problem.
  // They don't know it yet, but they're about to get a budget window.
  this.setAutoBudget(false);
  this.awaitingValues = true;
  this._emitEvent(messages.BUDGET_NEEDED);
  this._emitEvent(messages.NO_MONEY);
};


Budget.prototype.doBudgetSpend = function(roadValue, fireValue, policeValue) {
  this.roadSpend = roadValue;
  this.fireSpend = fireValue;
  this.policeSpend = policeValue;
  var total = this.roadSpend + this.fireSpend + this.policeSpend;

  this.spend(-(this.taxFund - total));
  this.updateFundEffects();
};


Budget.prototype.updateFundEffects = function() {
  // The caller is assumed to have correctly set the percentage spend
  this.roadSpend = Math.round(this.roadMaintenanceBudget * this.roadPercent);
  this.fireSpend = Math.round(this.fireMaintenanceBudget * this.firePercent);
  this.policeSpend = Math.round(this.policeMaintenanceBudget * this.policePercent);

  // Update the effect this level of spending will have on infrastructure deterioration
  this.roadEffect = this.MAX_ROAD_EFFECT;
  this.policeEffect = this.MAX_POLICESTATION_EFFECT;
  this.fireEffect = this.MAX_FIRESTATION_EFFECT;

  if (this.roadMaintenanceBudget > 0)
    this.roadEffect = Math.floor(this.roadEffect * this.roadSpend / this.roadMaintenanceBudget);

  if (this.fireMaintenanceBudget > 0)
    this.fireEffect = Math.floor(this.fireEffect * this.fireSpend / this.fireMaintenanceBudget);

  if (this.policeMaintenanceBudget > 0)
    this.policeEffect = Math.floor(this.policeEffect * this.policeSpend / this.policeMaintenanceBudget);
};


Budget.prototype.collectTax = function(gameLevel, census) {
  this.cashFlow = 0;

  // How much would it cost to fully fund every service?
  this.policeMaintenanceBudget = census.policeStationPop * policeMaintenanceCost;
  this.fireMaintenanceBudget = census.fireStationPop * fireMaintenanceCost;

  var roadCost = census.roadTotal * roadMaintenanceCost;
  var railCost = census.railTotal * railMaintenanceCost;
  this.roadMaintenanceBudget = Math.floor((roadCost + railCost) * RLevels[gameLevel]);

  this.taxFund = Math.floor(Math.floor(census.totalPop * census.landValueAverage / 120) * this.cityTax * FLevels[gameLevel]);

  if (census.totalPop > 0) {
    this.cashFlow = this.taxFund - (this.policeMaintenanceBudget + this.fireMaintenanceBudget + this.roadMaintenanceBudget);
    this.doBudgetNow(false);
  } else {
    // We don't want roads etc deteriorating when population hasn't yet been established
    // (particularly early game)
    this.roadEffect   = this.MAX_ROAD_EFFECT;
    this.policeEffect = this.MAX_POLICESTATION_EFFECT;
    this.fireEffect   = this.MAX_FIRESTATION_EFFECT;
  }
};


Budget.prototype.setTax = function(amount) {
  if (amount === this.cityTax)
    return;

  this.cityTax = amount;
};


Budget.prototype.setFunds = function(amount) {
  if (amount === this.totalFunds)
    return;

  this.totalFunds = Math.max(0, amount);

  this._emitEvent(messages.FUNDS_CHANGED, this.totalFunds);
  if (this.totalFunds === 0)
    this._emitEvent(messages.NO_MONEY);
};


Budget.prototype.spend = function(amount) {
  this.setFunds(this.totalFunds - amount);
};


Budget.prototype.shouldDegradeRoad = function() {
  return this.roadEffect < Math.floor(15 * this.MAX_ROAD_EFFECT / 16);
};




;// ./src/census.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */



var arrs = ['res', 'com', 'ind', 'crime',
            'money', 'pollution'];
function Census() {
  this.clearCensus();
  this.changed = false;
  this.crimeRamp = 0;
  this.pollutionRamp = 0;

  // Set externally
  this.landValueAverage = 0;
  this.pollutionAverage = 0;
  this.crimeAverage = 0;
  this.totalPop = 0;

  var createArray = function(arrName) {
    this[arrName] = [];
    for (var a = 0; a < 120; a++)
      this[arrName][a] = 0;
  };

  for (var i = 0; i < arrs.length; i++) {
    var name10 = arrs[i] + 'Hist10';
    var name120 = arrs[i] + 'Hist120';
    createArray.call(this, name10);
    createArray.call(this, name120);
  }
}


var rotate10Arrays = function() {
  for (var i = 0; i < arrs.length; i++) {
    var name10 = arrs[i] + 'Hist10';
    this[name10].pop();
    this[name10].unshift(0);
  }
};


var rotate120Arrays = function() {
  for (var i = 0; i < arrs.length; i++) {
    var name120 = arrs[i] + 'Hist120';
    this[name120].pop();
    this[name120].unshift(0);
  }
};


Census.prototype.clearCensus = function() {
  this.poweredZoneCount = 0;
  this.unpoweredZoneCount = 0;
  this.firePop = 0;
  this.roadTotal = 0;
  this.railTotal = 0;
  this.resPop = 0;
  this.comPop = 0;
  this.indPop = 0;
  this.resZonePop = 0;
  this.comZonePop = 0;
  this.indZonePop = 0;
  this.hospitalPop = 0;
  this.churchPop = 0;
  this.policeStationPop = 0;
  this.fireStationPop = 0;
  this.stadiumPop = 0;
  this.coalPowerPop = 0;
  this.nuclearPowerPop = 0;
  this.seaportPop = 0;
  this.airportPop = 0;
};


var census_saveProps = ['resPop', 'comPop', 'indPop', 'crimeRamp', 'pollutionRamp', 'landValueAverage', 'pollutionAverage',
             'crimeAverage', 'totalPop', 'resHist10', 'resHist120', 'comHist10', 'comHist120', 'indHist10',
             'indHist120', 'crimeHist10', 'crimeHist120', 'moneyHist10', 'moneyHist120', 'pollutionHist10',
             'pollutionHist120'];

Census.prototype.save = function(saveData) {
  for (var i = 0, l = census_saveProps.length; i < l; i++)
    saveData[census_saveProps[i]] = this[census_saveProps[i]];
};


Census.prototype.load = function(saveData) {
  for (var i = 0, l = census_saveProps.length; i < l; i++)
    this[census_saveProps[i]] = saveData[census_saveProps[i]];
};


Census.prototype.take10Census = function(budget) {
  var resPopDenom = 8;

  rotate10Arrays.call(this);

  this.resHist10[0] = Math.floor(this.resPop / resPopDenom);
  this.comHist10[0] = this.comPop;
  this.indHist10[0] = this.indPop;

  this.crimeRamp += Math.floor((this.crimeAverage - this.crimeRamp) / 4);
  this.crimeHist10[0] = Math.min(this.crimeRamp, 255);

  this.pollutionRamp += Math.floor((this.pollutionAverage - this.pollutionRamp) / 4);
  this.pollutionHist10[0] = Math.min(this.pollutionRamp, 255);

  var x = Math.floor(budget.cashFlow / 20) + 128;
  this.moneyHist10[0] = MiscUtils.clamp(x, 0, 255);

  var resPopScaled = this.resPop >> 8;

  if (this.hospitalPop < this.resPopScaled)
    this.needHospital = 1;
  else if (this.hospitalPop > this.resPopScaled)
    this.needHospital = -1;
  else if (this.hospitalPop === this.resPopScaled)
    this.needHospital = 0;

  this.changed = true;
};


Census.prototype.take120Census = function() {
  rotate120Arrays.call(this);
  var resPopDenom = 8;

  this.resHist120[0] = Math.floor(this.resPop / resPopDenom);
  this.comHist120[0] = this.comPop;
  this.indHist120[0] = this.indPop;
  this.crimeHist120[0] = this.crimeHist10[0];
  this.pollutionHist120[0] = this.pollutionHist10[0];
  this.moneyHist120[0] = this.moneyHist10[0];
  this.changed = true;
};




;// ./src/disasterManager.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */










var DisasterManager = EventEmitter(function(map, spriteManager, gameLevel) {
  this._map = map;
  this._spriteManager = spriteManager;
  this._gameLevel = gameLevel;

  this._floodCount = 0;
  this.disastersEnabled = false;
});


var DisChance = [479, 239, 59];

DisasterManager.prototype.doDisasters = function(census) {
  if (this._floodCount)
      this._floodCount--;

  // TODO Scenarios

  if (!this.disastersEnabled)
      return;

  if (!random.Random.getRandom(DisChance[this._gameLevel])) {
    switch (random.Random.getRandom(8)) {
      case 0:
      case 1:
        this.setFire();
        break;

      case 2:
      case 3:
        this.makeFlood();
        break;

      case 4:
        break;

      case 5:
        this._spriteManager.makeTornado();
        break;

      case 6:
        // TODO Earthquakes
        //this.makeEarthquake();
        break;

      case 7:
      case 8:
        if (census.pollutionAverage > 60)
          this._spriteManager.makeMonster();
        break;
    }
  }
};


DisasterManager.prototype.scenarioDisaster = function() {
  // TODO Scenarios
};


// User initiated meltdown: need to find the plant first
DisasterManager.prototype.makeMeltdown = function() {
  for (var x = 0; x < (this._map.width - 1); x++) {
    for (var y = 0; y < (this._map.height - 1); y++) {
      if (this._map.getTileValue(x, y) === src_tileValues.NUCLEAR) {
        this.doMeltdown(x, y);
        return;
      }
    }
  }
};


var vulnerable = function(tile) {
  var tileValue = tile.getValue();

  if (tileValue < src_tileValues.RESBASE || tileValue > src_tileValues.LASTZONE || tile.isZone())
    return false;

  return true;
};


// User initiated earthquake
DisasterManager.prototype.makeEarthquake = function() {
  var strength = random.Random.getRandom(700) + 300;
  this.doEarthquake(strength);

  this._emitEvent(messages.EARTHQUAKE, {x: this._map.cityCenterX, y: this._map.cityCenterY});

  for (var i = 0; i < strength; i++)  {
    var x = random.Random.getRandom(this._map.width - 1);
    var y = random.Random.getRandom(this._map.height - 1);

    if (!this._map.testBounds(x, y))
      continue;

    if (vulnerable(this._map.getTile(x, y))) {
      if ((i & 0x3) !== 0)
        this._map.setTo(x, y, TileUtils.randomRubble());
      else
        this._map.setTo(x, y, TileUtils.randomFire());
    }
  }
};


DisasterManager.prototype.setFire = function(times, zonesOnly) {
  times = times || 1;
  zonesOnly = zonesOnly || false;

  for (var i = 0; i < times; i++) {
    var x = random.Random.getRandom(this._map.width - 1);
    var y = random.Random.getRandom(this._map.height - 1);

    if (!this._map.testBounds(x, y))
      continue;

    var tile = this._map.getTile(x, y);

    if (!tile.isZone()) {
      tile = tile.getValue();
      var lowerLimit = zonesOnly ? src_tileValues.LHTHR : src_tileValues.TREEBASE;
      if (tile > lowerLimit && tile < src_tileValues.LASTZONE) {
        this._map.setTo(x, y, TileUtils.randomFire());
        this._emitEvent(messages.FIRE_REPORTED, {showable: true, x: x, y: y});
        return;
      }
    }
  }
};


// User initiated plane crash
DisasterManager.prototype.makeCrash = function() {
  var s = this._spriteManager.getSprite(spriteConstants/* SPRITE_AIRPLANE */.LQ);
  if (s !== null) {
    s.explodeSprite();
    return;
  }

  var x = random.Random.getRandom(this._map.width - 1);
  var y = random.Random.getRandom(this._map.height - 1);
  this._spriteManager.generatePlane(x, y);
  s = this._spriteManager.getSprite(spriteConstants/* SPRITE_AIRPLANE */.LQ);
  s.explodeSprite();
};


// User initiated fire
DisasterManager.prototype.makeFire = function() {
  this.setFire(40, false);
};


var Dx = [ 0, 1, 0, -1];
var Dy = [-1, 0, 1, 0];

DisasterManager.prototype.makeFlood = function() {
  for (var i = 0; i < 300; i++) {
    var x = random.Random.getRandom(this._map.width - 1);
    var y = random.Random.getRandom(this._map.height - 1);
    if (!this._map.testBounds(x, y))
      continue;

    var tileValue = this._map.getTileValue(x, y);

    if (tileValue > src_tileValues.CHANNEL && tileValue <= src_tileValues.WATER_HIGH) {
      for (var j = 0; j < 4; j++) {
        var xx = x + Dx[j];
        var yy = y + Dy[j];

        if (!this._map.testBounds(xx, yy))
          continue;

        var tile = this._map.getTile(xx, yy);
        tileValue = tile.getValue();

        if (tile === src_tileValues.DIRT || (tile.isBulldozable() && tile.isCombustible)) {
          this._map.setTile(xx, yy, src_tileValues.FLOOD, 0);
          this._floodCount = 30;
          this._emitEvent(messages.FLOODING_REPORTED, {showable: true, x: xx, y: yy});
          return;
        }
      }
    }
  }
};


DisasterManager.prototype.doFlood = function(x, y, blockMaps) {
  if (this._floodCount > 0) {
    // Flood is not over yet
    for (var i = 0; i < 4; i++) {
      if (random.Random.getChance(7)) {
        var xx = x + Dx[i];
        var yy = y + Dy[i];

        if (this._map.testBounds(xx, yy)) {
          var tile = this._map.getTile(xx, yy);
          var tileValue = tile.getValue();

          if (tile.isCombustible() || tileValue === src_tileValues.DIRT ||
              (tileValue >= src_tileValues.WOODS5 && tileValue < src_tileValues.FLOOD)) {
            if (tile.isZone())
              ZoneUtils.fireZone(this._map, xx, yy, blockMaps);

            this._map.setTile(xx, yy, src_tileValues.FLOOD + random.Random.getRandom(2), 0);
          }
        }
      }
    }
  } else {
    if (random.Random.getChance(15))
      this._map.setTile(x, y, src_tileValues.DIRT, 0);
  }
};


DisasterManager.prototype.doMeltdown = function(x, y) {
  this._spriteManager.makeExplosion(x - 1, y - 1);
  this._spriteManager.makeExplosion(x - 1, y + 2);
  this._spriteManager.makeExplosion(x + 2, y - 1);
  this._spriteManager.makeExplosion(x + 2, y + 2);

  var dY, dX;

  // Whole power plant is on fire
  for (dX = x - 1; dX < x + 3; dX++) {
    for (dY = y - 1; dY < y + 3; dY++) {
      this._map.setTo(dX, dY, TileUtils.randomFire());
    }
  }

  // Add lots of radiation tiles around the plant
  for (var i = 0; i < 200; i++)  {
    dX = x - 20 + random.Random.getRandom(40);
    dY = y - 15 + random.Random.getRandom(30);

    if (!this._map.testBounds(dX, dY))
      continue;

    var tile = this._map.getTile(dX, dY);

    if (tile.isZone())
        continue;

    if (tile.isCombustible() || tile.getValue() === src_tileValues.DIRT)
        this._map.setTile(dX, dY, src_tileValues.RADTILE, 0);
  }

  // Report disaster to the user
  this._emitEvent(messages.NUCLEAR_MELTDOWN, {showable: true, x: x, y: y});
};




;// ./src/emergencyServices.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */




var handleService = function(censusStat, budgetEffect, blockMap) {
  return function(map, x, y, simData) {
    simData.census[censusStat] += 1;

    var effect = simData.budget[budgetEffect];
    var isPowered = map.getTile(x, y).isPowered();
    // Unpowered buildings are half as effective
    if (!isPowered)
      effect = Math.floor(effect / 2);

    var pos = new position.Position(x, y);
    var connectedToRoads = simData.trafficManager.findPerimeterRoad(pos);
    if (!connectedToRoads)
      effect = Math.floor(effect / 2);

    var currentEffect = simData.blockMaps[blockMap].worldGet(x, y);
    currentEffect += effect;
    simData.blockMaps[blockMap].worldSet(x, y, currentEffect);
  };
};


var policeStationFound = handleService('policeStationPop', 'policeEffect', 'policeStationMap');
var fireStationFound = handleService('fireStationPop', 'fireEffect', 'fireStationMap');


var EmergencyServices = {
  registerHandlers: function(mapScanner, repairManager) {
    mapScanner.addAction(src_tileValues.POLICESTATION, policeStationFound);
    mapScanner.addAction(src_tileValues.FIRESTATION, fireStationFound);
  }
};




;// ./src/mapScanner.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */




// Tile to be filled to avoid creating lots of GC-able objects
var mapScanner_tile = new src_tile.Tile();


function MapScanner(map) {
  this._map = map;
  this._actions = [];
}


var isCallable = function(f) {
  return typeof(f) === 'function';
};


MapScanner.prototype.addAction = function(criterion, action) {
  this._actions.push({criterion: criterion, action: action});
};


MapScanner.prototype.mapScan = function(startX, maxX, simData) {
  for (var y = 0; y < this._map.height; y++) {
    for (var x = startX; x < maxX; x++) {
      this._map.getTile(x, y, mapScanner_tile);
      var tileValue = mapScanner_tile.getValue();

      if (tileValue < src_tileValues.FLOOD)
        continue;

      if (mapScanner_tile.isConductive())
        simData.powerManager.setTilePower(x, y);

      if (mapScanner_tile.isZone()) {
        simData.repairManager.checkTile(x, y, simData.cityTime);
        var powered = mapScanner_tile.isPowered();
        if (powered)
          simData.census.poweredZoneCount += 1;
        else
          simData.census.unpoweredZoneCount += 1;
      }

      for (var i = 0, l = this._actions.length; i < l; i++) {
        var current = this._actions[i];
        var callable = isCallable(current.criterion);

        if (callable && current.criterion.call(null, mapScanner_tile)) {
          current.action.call(null, this._map, x, y, simData);
          break;
        } else if (!callable && current.criterion === tileValue) {
          current.action.call(null, this._map, x, y, simData);
          break;
        }
      }
    }
  }
};




;// ./src/miscTiles.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */






var miscTiles_xDelta = [-1,  0,  1,  0 ];
var miscTiles_yDelta = [ 0, -1,  0,  1 ];

var fireFound = function(map, x, y, simData) {
  simData.census.firePop += 1;

  if ((random.Random.getRandom16() & 3) !== 0)
    return;

  // Try to set neighbouring tiles on fire as well
  for (var i = 0; i < 4; i++) {
    if (random.Random.getChance(7)) {
      var xTem = x + miscTiles_xDelta[i];
      var yTem = y + miscTiles_yDelta[i];

      if (map.testBounds(xTem, yTem)) {
        var tile = map.getTile(x, y);
        if (!tile.isCombustible())
            continue;

        if (tile.isZone()) {
          // Neighbour is a ione and burnable
          ZoneUtils.fireZone(map, x, y, simData.blockMaps);

          // Industrial zones etc really go boom
          if (tile.getValue() > src_tileValues.IZB)
            simData.spriteManager.makeExplosionAt(x, y);
        }

        map.setTo(tileUtils.randomFire());
      }
    }
  }

  // Compute likelyhood of fire running out of fuel
  var rate = 10; // Likelyhood of extinguishing (bigger means less chance)
  i = simData.blockMaps.fireStationEffectMap.worldGet(x, y);

  if (i > 100)
    rate = 1;
  else if (i > 20)
    rate = 2;
  else if (i > 0)
    rate = 3;

  // Decide whether to put out the fire.
  if (random.Random.getRandom(rate) === 0)
    map.setTo(x, y, TileUtils.randomRubble());
};


var radiationFound = function(map, x, y, simData) {
  if (random.Random.getChance(4095))
    map.setTile(x, y, src_tileValues.DIRT, 0);
};


var floodFound = function(map, x, y, simData) {
  simData.disasterManager.doFlood(x, y, simData.blockMaps);
};


var MiscTiles = {
  registerHandlers: function(mapScanner, repairManager) {
    mapScanner.addAction(TileUtils.isFire, fireFound, true);
    mapScanner.addAction(src_tileValues.RADTILE, radiationFound, true);
    mapScanner.addAction(TileUtils.isFlood, floodFound, true);
  }
};




;// ./src/powerManager.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */










var COAL_POWER_STRENGTH = 700;
var NUCLEAR_POWER_STRENGTH = 2000;


var PowerManager = EventEmitter(function(map) {
  this._map = map;
  this._powerStack = [];
  this.powerGridMap = new blockMap/* BlockMap */.Q(this._map.width, this._map.height, 1);
});


PowerManager.prototype.setTilePower = function(x, y) {
  var tile = this._map.getTile(x, y);
  var tileValue = tile.getValue();

  if (tileValue === src_tileValues.NUCLEAR || tileValue === src_tileValues.POWERPLANT ||
      this.powerGridMap.worldGet(x, y) > 0) {
    tile.addFlags(src_tileFlags.POWERBIT);
    return;
  }

  tile.removeFlags(src_tileFlags.POWERBIT);
};


PowerManager.prototype.clearPowerStack = function() {
  this._powerStackPointer = 0;
  this._powerStack = [];
};


PowerManager.prototype.testForConductive = function(pos, testDir) {
  var movedPos = position.Position.move(pos, testDir);

  if (this._map.isPositionInBounds(movedPos)) {
    if (this._map.getTile(movedPos.x, movedPos.y).isConductive()) {
      if (this.powerGridMap.worldGet(movedPos.x, movedPos.y) === 0)
          return true;
    }
  }

  return false;
};


// Note: the algorithm is buggy: if you have two adjacent power
// plants, the second will be regarded as drawing power from the first
// rather than as a power source itself
PowerManager.prototype.doPowerScan = function(census) {
  // Clear power this._map.
  this.powerGridMap.clear();

  // Power that the combined coal and nuclear power plants can deliver.
  var maxPower = census.coalPowerPop * COAL_POWER_STRENGTH +
                 census.nuclearPowerPop * NUCLEAR_POWER_STRENGTH;

  var powerConsumption = 0; // Amount of power used.

  while (this._powerStack.length > 0) {
    var pos = this._powerStack.pop();
    var anyDir = undefined;
    var conNum;
    do {
      powerConsumption++;
      if (powerConsumption > maxPower) {
        this._emitEvent(messages.NOT_ENOUGH_POWER);
        return;
      }

      if (anyDir)
        pos = position.Position.move(pos, anyDir);

      this.powerGridMap.worldSet(pos.x, pos.y, 1);
      conNum = 0;

      (0,direction.forEachCardinalDirection)(dir => {
        if (conNum >= 2) {
          return;
        }

        if (this.testForConductive(pos, dir)) {
          conNum++;
          anyDir = dir;
        }
      });

      if (conNum > 1)
        this._powerStack.push(new position.Position(pos.x, pos.y));
    } while (conNum);
  }
};


PowerManager.prototype.coalPowerFound = function(map, x, y, simData) {
  simData.census.coalPowerPop += 1;

  this._powerStack.push(new position.Position(x, y));

  // Ensure animation runs
  var dX = [-1, 2, 1, 2];
  var dY = [-1, -1, 0, 0];

  for (var i = 0; i < 4; i++)
    map.addTileFlags(x + dX[i], y + dY[i], src_tileFlags.ANIMBIT);
};


var dX = (/* unused pure expression or super */ null && ([1, 2, 1, 2]));
var dY = (/* unused pure expression or super */ null && ([-1, -1, 0, 0]));
var meltdownTable = [30000, 20000, 10000];

PowerManager.prototype.nuclearPowerFound = function(map, x, y, simData) {
  // TODO With the auto repair system, zone gets repaired before meltdown
  // In original Micropolis code, we bail and don't repair if melting down
  if (simData.disasterManager.disastersEnabled &&
      random.Random.getRandom(meltdownTable[simData.gameLevel]) === 0) {
    simData.disasterManager.doMeltdown(x, y);
    return;
  }

  simData.census.nuclearPowerPop += 1;
  this._powerStack.push(new position.Position(x, y));

  // Ensure animation bits set
  for (var i = 0; i < 4; i++)
    map.addTileFlags(x, y, src_tileFlags.ANIMBIT | src_tileFlags.CONDBIT | src_tileFlags.POWERBIT | src_tileFlags.BURNBIT);
};


PowerManager.prototype.registerHandlers = function(mapScanner, repairManager) {
  mapScanner.addAction(src_tileValues.POWERPLANT, this.coalPowerFound.bind(this));
  mapScanner.addAction(src_tileValues.NUCLEAR, this.nuclearPowerFound.bind(this));
  repairManager.addAction(src_tileValues.POWERPLANT, 7, 4);
  repairManager.addAction(src_tileValues.NUCLEAR, 7, 4);
};




;// ./src/repairManager.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */




function RepairManager(map) {
  this._map = map;
  this._actions = [];
}


var repairManager_isCallable = function(f) {
  return typeof(f) === 'function';
};


RepairManager.prototype.addAction = function(criterion, period, zoneSize) {
  this._actions.push({criterion: criterion, period: period, zoneSize: zoneSize});
};


RepairManager.prototype.repairZone = function(x, y, zoneSize) {
  var centre = this._map.getTileValue(x, y);
  var tileValue = centre - zoneSize - 2;

  for (var yy = -1; yy < zoneSize - 1; yy++) {
    for (var xx = -1; xx < zoneSize - 1; xx++) {
      tileValue++;

      var current = this._map.getTile(x + xx, y + yy);
      if (current.isZone() || current.isAnimated())
        continue;

      var currentValue = current.getValue();
      if (currentValue < src_tileValues.RUBBLE || currentValue >= src_tileValues.ROADBASE)
        this._map.setTile(x + xx, y + yy, tileValue, src_tileFlags.CONDBIT | src_tileFlags.BURNBIT);
    }
  }
};


RepairManager.prototype.checkTile = function(x, y, cityTime) {
  for (var i = 0, l = this._actions.length; i < l; i++) {
    var current = this._actions[i];
    var period = current.period;

    if ((cityTime & period) !== 0)
      continue;

    var tile = this._map.getTile(x, y);
    var tileValue = tile.getValue();

    var callable = repairManager_isCallable(current.criterion);
    if (callable && current.criterion.call(null, tile))
      this.repairZone(x, y, current.zoneSize);
    else if (!callable && current.criterion === tileValue)
      this.repairZone(x, y, current.zoneSize);
  }
};




;// ./src/road.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */







var openBridge = function(map, origX, origY, xDelta, yDelta, oldTiles, newTiles) {
  for (var i = 0; i < 7; i++) {
    var x = origX + xDelta[i];
    var y = origY + yDelta[i];

    if (map.testBounds(x, y)) {
      if (map.getTileValue(x, y) === (oldTiles[i] & src_tileFlags.BIT_MASK))
        map.setTileValue(x, y, newTiles[i]);
    }
  }
};


var closeBridge = function(map, origX, origY, xDelta, yDelta, oldTiles, newTiles) {
  for (var i = 0; i < 7; i++) {
    var x = origX + xDelta[i];
    var y = origY + yDelta[i];

    if (map.testBounds(x, y)) {
      var tileValue = map.getTileValue(x, y);
      if (tileValue === src_tileValues.CHANNEL || (tileValue & 15) === (oldTiles[i] & 15))
        map.setTileValue(x, y, newTiles[i]);
    }
  }
};


var verticalDeltaX = [0,  1,  0,  0,  0,  0,  1];
var verticalDeltaY = [-2, -2, -1,  0,  1,  2,  2];
var openVertical = [
      src_tileValues.VBRDG0 | src_tileFlags.BULLBIT, src_tileValues.VBRDG1 | src_tileFlags.BULLBIT,
      src_tileValues.RIVER, src_tileValues.BRWV | src_tileFlags.BULLBIT,
      src_tileValues.RIVER, src_tileValues.VBRDG2 | src_tileFlags.BULLBIT, src_tileValues.VBRDG3 | src_tileFlags.BULLBIT];
var closeVertical = [
      src_tileValues.VBRIDGE | src_tileFlags.BULLBIT, src_tileValues.RIVER, src_tileValues.VBRIDGE | src_tileFlags.BULLBIT,
      src_tileValues.VBRIDGE | src_tileFlags.BULLBIT, src_tileValues.VBRIDGE | src_tileFlags.BULLBIT,
      src_tileValues.VBRIDGE | src_tileFlags.BULLBIT, src_tileValues.RIVER];
var horizontalDeltaX = [-2,  2, -2, -1,  0,  1,  2];
var horizontalDeltaY = [ -1, -1,  0,  0,  0,  0,  0];
var openHorizontal = [
    src_tileValues.HBRDG1 | src_tileFlags.BULLBIT, src_tileValues.HBRDG3 | src_tileFlags.BULLBIT,
    src_tileValues.HBRDG0 | src_tileFlags.BULLBIT, src_tileValues.RIVER, src_tileValues.BRWH | src_tileFlags.BULLBIT,
    src_tileValues.RIVER, src_tileValues.HBRDG2 | src_tileFlags.BULLBIT
];
var closeHorizontal = [
    src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.HBRIDGE | src_tileFlags.BULLBIT,
    src_tileValues.HBRIDGE | src_tileFlags.BULLBIT, src_tileValues.HBRIDGE | src_tileFlags.BULLBIT,
    src_tileValues.HBRIDGE | src_tileFlags.BULLBIT, src_tileValues.HBRIDGE | src_tileFlags.BULLBIT
];


var doBridge = function(map, x, y, currentTile, simData) {
  if (currentTile === src_tileValues.BRWV) {
    // We have an open vertical bridge. Possibly close it.
    if (random.Random.getChance(3) && simData.spriteManager.getBoatDistance(x, y) > 340)
      closeBridge(map, x, y, verticalDeltaX, verticalDeltaY, openVertical, closeVertical);

    return true;
  }

  if (currentTile == src_tileValues.BRWH) {
    // We have an open horizontal bridge. Possibly close it.
    if (random.Random.getChance(3) && simData.spriteManager.getBoatDistance(x, y) > 340)
      closeBridge(map, x, y, horizontalDeltaX, horizontalDeltaY, openHorizontal, closeHorizontal);

    return true;
  }

  if (simData.spriteManager.getBoatDistance(x, y) < 300 || random.Random.getChance(7)) {
    if (currentTile & 1) {
      if (x < map.width - 1) {
        if (map.getTileValue(x + 1, y) === src_tileValues.CHANNEL) {
          // We have a closed vertical bridge. Open it.
          openBridge(map, x, y, verticalDeltaX, verticalDeltaY, closeVertical, openVertical);
          return true;
        }
      }
      return false;
    } else {
      if (y > 0) {
        if (map.getTileValue(x, y - 1) === src_tileValues.CHANNEL) {
          // We have a closed horizontal bridge. Open it.
          openBridge(map, x, y, horizontalDeltaX, horizontalDeltaY, closeHorizontal, openHorizontal);
          return true;
        }
      }
    }
  }

  return false;
};


var densityTable = [src_tileValues.ROADBASE, src_tileValues.LTRFBASE, src_tileValues.HTRFBASE];

var roadFound = function(map, x, y, simData) {
  simData.census.roadTotal += 1;

  var currentTile = map.getTile(x, y);
  var tileValue = currentTile.getValue();

  if (simData.budget.shouldDegradeRoad()) {
    if (random.Random.getChance(511)) {
      currentTile = map.getTile(x, y);

      // Don't degrade tiles with power lines
      if (!currentTile.isConductive()) {
        if (simData.budget.roadEffect < (random.Random.getRandom16() & 31)) {
          var mapValue = currentTile.getValue();

          // Replace bridge tiles with water, otherwise rubble
          if ((tileValue & 15) < 2 || (tileValue & 15) === 15)
            map.setTile(x, y, src_tileValues.RIVER, 0);
          else
            map.setTo(x, y, TileUtils.randomRubble());

          return;
        }
      }
    }
  }

  // Bridges are not combustible
  if (!currentTile.isCombustible()) {
    // The comment in the original Micropolis code states bridges count for 4
    // However, with the increment above, it's actually 5. Bug?
    simData.census.roadTotal += 4;
    if (doBridge(map, x, y, tileValue, simData))
      return;
  }

  // Examine traffic density, and modify tile to represent last scanned traffic
  // density
  var density = 0;
  if (tileValue < src_tileValues.LTRFBASE) {
    density = 0;
  } else if (tileValue < src_tileValues.HTRFBASE) {
    density = 1;
  } else {
    // Heavy traffic counts as two tiles with regards to upkeep cost
    // Note, if this is heavy traffic on a bridge, and it wasn't handled above,
    // it actually counts for 7 road tiles
    simData.census.roadTotal += 1;
    density = 2;
  }

  // Force currentDensity in range 0-3 (trafficDensityMap values are capped at 240)
  var currentDensity = simData.blockMaps.trafficDensityMap.worldGet(x, y) >> 6;
  if (currentDensity > 1)
    currentDensity -= 1;

  if (currentDensity === density)
    return;

  var newValue = ((tileValue - src_tileValues.ROADBASE) & 15) + densityTable[currentDensity];
  // Preserve all bits except animation
  var newFlags = currentTile.getFlags() & ~src_tileFlags.ANIMBIT;
  if (currentDensity > 0)
   newFlags |= src_tileFlags.ANIMBIT;

  map.setTo(x, y, new src_tile.Tile(newValue, newFlags));
};


var Road = {
  registerHandlers: function(mapScanner, repairManager) {
    mapScanner.addAction(TileUtils.isRoad, roadFound);
  }
};




;// ./src/baseSprite.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */




var baseSprite_init = function(type, map, spriteManager, x, y) {
  this.type = type;
  this.map = map;
  this.spriteManager = spriteManager;

  var pixX = x;
  var pixY = y;
  var worldX = x >> 4;
  var worldY = y >> 4;

  Object.defineProperty(this, 'x',
    {configurable: false,
     enumerable: true,
     set: function(val) {
       // XXX These getters have implicit knowledge of tileWidth: need to decide whether to disallow non 16px tiles
       pixX = val;
       worldX = val >> 4;
     },
     get: function() {
      return pixX;
     }
  });

  Object.defineProperty(this, 'y',
    {configurable: false,
     enumerable: true,
     set: function(val) {
       pixY = val;
       worldY = val >> 4;
     },
     get: function() {
      return pixY;
     }
  });

  Object.defineProperty(this, 'worldX',
    {configurable: false,
     enumerable: true,
     set: function(val) {
       worldX = val;
       pixX = val << 4;
     },
     get: function() {
      return worldX;
     }
  });

  Object.defineProperty(this, 'worldY',
    {configurable: false,
     enumerable: true,
     set: function(val) {
       worldY = val;
       pixY = val << 4;
     },
     get: function() {
      return worldY;
     }
  });

  this.origX = 0;
  this.origY = 0;
  this.destX = 0;
  this.destY = 0;
  this.count = 0;
  this.soundCount = 0;
  this.dir = 0;
  this.newDir = 0;
  this.step = 0;
  this.flag = 0;
  this.turn = 0;
  this.accel = 0;
  this.speed = 100;
};


var getFileName = function() {
  return ['obj', this.type, '-', this.frame - 1].join('');
};


var spriteNotInBounds = function() {
  var x = this.worldX;
  var y = this.worldY;

  return x < 0 || y < 0 || x >= this.map.width || y >= this.map.height;
};


var base = {
  init: baseSprite_init,
  getFileName: getFileName,
  spriteNotInBounds: spriteNotInBounds
};


var BaseSprite = function(spriteConstructor) {
  spriteConstructor.prototype = Object.create(base);
  EventEmitter(spriteConstructor);
};




;// ./src/airplaneSprite.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */








function AirplaneSprite(map, spriteManager, x, y) {
  this.init(spriteConstants/* SPRITE_AIRPLANE */.LQ, map, spriteManager, x, y);
  this.width = 48;
  this.height = 48;
  this.xOffset = -24;
  this.yOffset = -24;
  if (x > SpriteUtils.worldToPix(map.width - 20)) {
    this.destX = this.x - 200;
    this.frame = 7;
  } else {
    this.destX = this.x + 200;
    this.frame = 11;
  }
  this.destY = this.y;
}


BaseSprite(AirplaneSprite);


var airplaneSprite_xDelta = [0, 0, 6, 8, 6, 0, -6, -8, -6, 8, 8, 8];
var airplaneSprite_yDelta = [0, -8, -6, 0, 6, 8,  6, 0, -6, 0, 0, 0];

AirplaneSprite.prototype.move = function(spriteCycle, disasterManager, blockMaps) {
  var frame = this.frame;

  if ((spriteCycle % 5) === 0) {
    // Frames > 8 mean the plane is taking off
    if (frame > 8) {
      frame--;
      if (frame < 9) {
        // Planes always take off to the east
        frame = 3;
      }
      this.frame = frame;
    } else {
      var d = SpriteUtils.getDir(this.x, this.y, this.destX, this.destY);
      frame = SpriteUtils.turnTo(frame, d);
      this.frame = frame;
    }
  }

  var absDist = SpriteUtils.absoluteDistance(this.x, this.y, this.destX, this.destY);
  if (absDist < 50) {
    // We're pretty close to the destination
    this.destX = random.Random.getRandom(SpriteUtils.worldToPix(this.map.width)) + 8;
    this.destY = random.Random.getRandom(SpriteUtils.worldToPix(this.map.height)) + 8;
  }

  if (disasterManager.enableDisasters) {
    var explode = false;

    var spriteList = this.spriteManager.getSpriteList();
    for (var i = 0; i < spriteList.length; i++) {
      var s = spriteList[i];

      if (s.frame === 0 || s === this)
        continue;

      if ((s.type === spriteConstants/* SPRITE_HELICOPTER */.MT ||
           s.type === spriteConstants/* SPRITE_AIRPLANE */.LQ) &&
            SpriteUtils.checkSpriteCollision(this, s)) {
        s.explodeSprite();
        explode = true;
      }
    }

    if (explode)
      this.explodeSprite();
  }

  this.x += airplaneSprite_xDelta[frame];
  this.y += airplaneSprite_yDelta[frame];

  if (this.spriteNotInBounds())
    this.frame = 0;
};


AirplaneSprite.prototype.explodeSprite = function() {
  this.frame = 0;
  this.spriteManager.makeExplosionAt(this.x, this.y);
  this._emitEvent(messages.PLANE_CRASHED, {showable: true, x: this.worldX, y: this.worldY});
};


// Metadata for image loading
Object.defineProperties(AirplaneSprite,
  {ID: MiscUtils.makeConstantDescriptor(3),
   width: MiscUtils.makeConstantDescriptor(48),
   frames: MiscUtils.makeConstantDescriptor(11)});




;// ./src/boatSprite.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */










function BoatSprite(map, spriteManager, x, y) {
  this.init(spriteConstants/* SPRITE_SHIP */.HK, map, spriteManager, x, y);
  this.width = 48;
  this.height = 48;
  this.xOffset = -24;
  this.yOffset = -24;

  if (x < SpriteUtils.worldToPix(4))
    this.frame = 3;
  else if (x >= SpriteUtils.worldToPix(map.width - 4))
    this.frame = 7;
  else if (y < SpriteUtils.worldToPix(4))
    this.frame = 5;
  else if (y >= SpriteUtils.worldToPix(map.height - 4))
    this.frame = 1;
  else
    this.frame = 3;

  this.newDir = this.frame;
  this.dir = 10;
  this.count = 1;
}


BaseSprite(BoatSprite);


// This is an odd little function. It returns true if
// oldDir is 180° from newDir and tileValue is underwater
// rail or wire, and returns false otherwise
var oppositeAndUnderwater = function(tileValue, oldDir, newDir) {
  var opposite = oldDir + 4;

  if (opposite > 8)
    opposite -= 8;

  if (newDir != opposite)
    return false;

  if (tileValue == src_tileValues.POWERBASE || tileValue == src_tileValues.POWERBASE + 1 ||
      tileValue == src_tileValues.RAILBASE || tileValue == src_tileValues.RAILBASE + 1)
    return true;

  return false;
};


var tileDeltaX = [0,  0,  1,  1,  1,  0, -1, -1, -1];
var tileDeltaY = [0, -1, -1,  0,  1,  1,  1,  0, -1];
var boatSprite_xDelta = [0,  0,  2,  2,  2,  0, -2, -2, -2];
var boatSprite_yDelta = [0, -2, -2,  0,  2,  2,  2,  0, -2];
var tileWhiteList = [src_tileValues.RIVER, src_tileValues.CHANNEL, src_tileValues.POWERBASE,
                src_tileValues.POWERBASE + 1, src_tileValues.RAILBASE,
                src_tileValues.RAILBASE + 1, src_tileValues.BRWH, src_tileValues.BRWV];

var CANTMOVE = 10;

BoatSprite.prototype.move = function(spriteCycle, disasterManager, blockMaps) {
  var tile = src_tileValues.RIVER;
  var frame, x, y;

  if (this.soundCount > 0)
    this.soundCount--;

  if (this.soundCount === 0) {
    if ((random.Random.getRandom16() & 3) === 1) {
      // TODO Scenarios
      // TODO Sound
      this._emitEvent(messages.SOUND_HONKHONK);
    }

    this.soundCount = 200;
  }

  if (this.count > 0)
      this.count--;


  if (this.count === 0) {
    // Ships turn slowly: only 45° every 9 cycles
    this.count = 9;

    // If already executing a turn, continue to do so
    if (this.frame !== this.newDir) {
      this.frame = SpriteUtils.turnTo(this.frame, this.newDir);
      return;
    }

    // Otherwise pick a new direction
    // Choose a random starting direction to search from
    // 0 = N, 1 = NE, ... 7 = NW
    var startDir = random.Random.getRandom16() & 7;

    for (var dir = startDir; dir < (startDir + 8); dir++) {
      frame = (dir & 7) + 1;

      if (frame === this.dir)
        continue;

      x = this.worldX + tileDeltaX[frame];
      y = this.worldY + tileDeltaY[frame];

      if (this.map.testBounds(x, y)) {
        tile = this.map.getTileValue(x, y);

        // Test for a suitable water tile
        if (tile === src_tileValues.CHANNEL || tile === src_tileValues.BRWH ||
            tile === src_tileValues.BRWV || oppositeAndUnderwater(tile, this.dir, frame)) {
          this.newDir = frame;
          this.frame = SpriteUtils.turnTo(this.frame, this.newDir);
          this.dir = frame + 4;

          if (this.dir > 8)
            this.dir -= 8;
          break;
        }
      }
    }

    if (dir === (startDir + 8)) {
      this.dir = CANTMOVE;
      this.newDir = (random.Random.getRandom16() & 7) + 1;
    }
  } else {
    frame = this.frame;

    if (frame === this.newDir)  {
      this.x += boatSprite_xDelta[frame];
      this.y += boatSprite_yDelta[frame];
    }
  }

  if (this.spriteNotInBounds()) {
    this.frame = 0;
    return;
  }

  // If we didn't find a new direction, we might explode
  // depending on the last tile we looked at.
  for (var i = 0; i < 8; i++) {
    if (tile === tileWhiteList[i]) {
      break;
    }

    if (i === 7) {
      this.explodeSprite();
      SpriteUtils.destroyMapTile(this.spriteManager, this.map, blockMaps, this.x, this.y);
    }
  }
};


BoatSprite.prototype.explodeSprite = function() {
  this.frame = 0;
  this.spriteManager.makeExplosionAt(this.x, this.y);
  this._emitEvent(messages.SHIP_CRASHED, {showable: true, x: this.worldX, y: this.worldY});
};


// Metadata for image loading
Object.defineProperties(BoatSprite,
  {ID: MiscUtils.makeConstantDescriptor(4),
   width: MiscUtils.makeConstantDescriptor(48),
   frames: MiscUtils.makeConstantDescriptor(8)});




;// ./src/copterSprite.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */








function CopterSprite(map, spriteManager, x, y) {
  this.init(spriteConstants/* SPRITE_HELICOPTER */.MT, map, spriteManager, x, y);
  this.width = 32;
  this.height = 32;
  this.xOffset = -16;
  this.yOffset = -16;
  this.frame = 5;
  this.count = 1500;
  this.destX = random.Random.getRandom(SpriteUtils.worldToPix(map.width)) + 8;
  this.destY = random.Random.getRandom(SpriteUtils.worldToPix(map.height)) + 8;
  this.origX = x;
  this.origY = y;
}


BaseSprite(CopterSprite);


var copterSprite_xDelta = [0, 0, 3, 5, 3, 0, -3, -5, -3];
var copterSprite_yDelta = [0, -5, -3, 0, 3, 5, 3, 0, -3];

CopterSprite.prototype.move = function(spriteCycle, disasterManager, blockMaps) {
  if (this.soundCount > 0)
    this.soundCount--;

  if (this.count > 0)
    this.count--;

  if (this.count === 0) {
    // Head towards a monster, and certain doom
    var s = this.spriteManager.getSprite(spriteConstants/* SPRITE_MONSTER */.bn);

    if (s !== null) {
      this.destX = s.x;
      this.destY = s.y;
    } else {
      // No monsters. Hm. I bet flying near that tornado is sensible
      s = this.spriteManager.getSprite(spriteConstants/* SPRITE_TORNADO */.OR);

      if (s !== null) {
          this.destX = s.x;
          this.destY = s.y;
      } else {
          this.destX = this.origX;
          this.destY = this.origY;
      }
    }

    // If near destination, let's get her on the ground
    var absDist = SpriteUtils.absoluteDistance(this.x, this.y, this.origX, this.origY);
    if (absDist < 30) {
      this.frame = 0;
      return;
    }
  }

  if (this.soundCount === 0) {
      var x = this.worldX;
      var y = this.worldY;

      if (x >= 0 && x < this.map.width && y >= 0 && y < this.map.height) {
        if (blockMaps.trafficDensityMap.worldGet(x, y) > 170 && (random.Random.getRandom16() & 7) === 0) {
          this._emitEvent(messages.HEAVY_TRAFFIC, {x: x, y: y});
          this._emitEvent(messages.SOUND_HEAVY_TRAFFIC);
          this.soundCount = 200;
      }
    }
  }

  var frame = this.frame;

  if ((spriteCycle & 3) === 0) {
    var dir = SpriteUtils.getDir(this.x, this.y, this.destX, this.destY);
    frame = SpriteUtils.turnTo(frame, dir);
    this.frame = frame;
  }

  this.x += copterSprite_xDelta[frame];
  this.y += copterSprite_yDelta[frame];
};


CopterSprite.prototype.explodeSprite = function() {
  this.frame = 0;
  this.spriteManager.makeExplosionAt(this.x, this.y);
  this._emitEvent(messages.HELICOPTER_CRASHED, {x: this.worldX, y: this.worldY});
};


// Metadata for image loading
Object.defineProperties(CopterSprite,
  {ID: MiscUtils.makeConstantDescriptor(2),
   width: MiscUtils.makeConstantDescriptor(32),
   frames: MiscUtils.makeConstantDescriptor(8)});




;// ./src/explosionSprite.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */










function ExplosionSprite(map, spriteManager, x, y) {
  this.init(spriteConstants/* SPRITE_EXPLOSION */.Ev, map, spriteManager, x, y);
  this.width = 48;
  this.height = 48;
  this.xOffset = -24;
  this.yOffset = -24;
  this.frame = 1;
}


BaseSprite(ExplosionSprite);


ExplosionSprite.prototype.startFire = function(x, y) {
  x = this.worldX;
  y = this.worldY;

  if (!this.map.testBounds(x, y))
    return;

  var tile = this.map.getTile(x, y);
  var tileValue = tile.getValue();

  if (!tile.isCombustible() && tileValue !== src_tileValues.DIRT)
    return;

  if (tile.isZone())
    return;

  this.map.setTo(x, y, TileUtils.randomFire());
};


ExplosionSprite.prototype.move = function(spriteCycle, disasterManager, blockMaps) {
  if ((spriteCycle & 1) === 0) {
    if (this.frame === 1) {
      // Convert sprite coordinates to tile coordinates.
      var explosionX = this.worldX;
      var explosionY = this.worldY;
      this._emitEvent(messages.SOUND_EXPLOSIONHIGH);
      this._emitEvent(messages.EXPLOSION_REPORTED, {x: explosionX, y: explosionY});
    }

    this.frame++;
  }

  if (this.frame > 6) {
    this.frame = 0;

    this.startFire(this.x, this.y);
    this.startFire(this.x - 16, this.y - 16);
    this.startFire(this.x + 16, this.y + 16);
    this.startFire(this.x - 16, this.y + 16);
    this.startFire(this.x + 16, this.y + 16);
  }
};


// Metadata for image loading
Object.defineProperties(ExplosionSprite,
  {ID: MiscUtils.makeConstantDescriptor(7),
   width: MiscUtils.makeConstantDescriptor(48),
   frames: MiscUtils.makeConstantDescriptor(6)});




;// ./src/monsterSprite.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */










function MonsterSprite(map, spriteManager, x, y) {
  this.init(spriteConstants/* SPRITE_MONSTER */.bn, map, spriteManager, x, y);
  this.width = 48;
  this.height = 48;
  this.xOffset = -24;
  this.yOffset = -24;

  if (x > SpriteUtils.worldToPix(map.width) / 2) {
    if (y > SpriteUtils.worldToPix(map.height) / 2)
      this.frame = 10;
    else
      this.frame = 7;
  } else if (y > SpriteUtils.worldToPix(map.height) / 2) {
      this.frame = 1;
  } else {
      this.frame = 4;
  }

  this.flag = 0;
  this.count = 1000;
  this.destX = SpriteUtils.worldToPix(map.pollutionMaxX);
  this.destY = SpriteUtils.worldToPix(map.pollutionMaxY);
  this.origX = this.x;
  this.origY = this.y;
  this._seenLand = false;
}


BaseSprite(MonsterSprite);


var monsterSprite_xDelta = [ 2, 2, -2, -2, 0];
var monsterSprite_yDelta = [-2, 2, 2, -2, 0];
var cardinals1 = [ 0, 1, 2, 3];
var cardinals2 = [ 1, 2, 3, 0];
var diagonals1 = [ 2, 5, 8, 11];
var diagonals2 = [11, 2, 5, 8];

MonsterSprite.prototype.move = function(spriteCycle, disasterManager, blockMaps) {
  if (this.soundCount > 0)
    this.soundCount--;

  // Frames 1 - 12 are diagonal sprites, 3 for each direction.
  // 1-3 NE, 2-6 SE, etc. 13-16 represent the cardinal directions.
  var currentDir = Math.floor((this.frame - 1) / 3);
  var frame, dir;

  if (currentDir < 4) { /* turn n s e w */
    // Calculate how far in the 3 step animation we were,
    // move on to the next one
    frame = (this.frame - 1) % 3;

    if (frame === 2)
      this.step = 0;

    if (frame === 0)
      this.step = 1;

    if (this.step)
      frame++;
    else
      frame--;

    var absDist = SpriteUtils.absoluteDistance(this.x, this.y, this.destX, this.destY);

    if (absDist < 60) {
      if (this.flag === 0) {
        this.flag = 1;
        this.destX = this.origX;
        this.destY = this.origY;
      } else {
        this.frame = 0;
        this._emitEvent(messages.SPRITE_DYING);
        return;
      }
    }

    // Perhaps switch to a cardinal direction
    dir = SpriteUtils.getDir(this.x, this.y, this.destX, this.destY);
    dir = Math.floor((dir - 1) / 2);

    if (dir !== currentDir && random.Random.getChance(10)) {
      if (random.Random.getRandom16() & 1)
        frame = cardinals1[currentDir];
      else
        frame = cardinals2[currentDir];

      currentDir = 4;

      if (!this.soundCount) {
        this._emitEvent(messages.SOUND_MONSTER);
        this.soundCount = 50 + random.Random.getRandom(100);
      }
    }
  } else {
    // Travelling in a cardinal direction. Switch to a diagonal
    currentDir = 4;
    dir = this.frame;
    frame = (dir - 13) & 3;

    if (!(random.Random.getRandom16() & 3)) {
      if (random.Random.getRandom16() & 1)
        frame = diagonals1[frame];
      else
        frame = diagonals2[frame];

      // We mung currentDir and frame here to
      // make the assignment below work
      currentDir = Math.floor((frame - 1) / 3);
      frame = (frame - 1) % 3;
    }
  }

  frame = currentDir * 3 + frame + 1;
  if (frame > 16)
    frame = 16;

  this.frame = frame;

  this.x += monsterSprite_xDelta[currentDir];
  this.y += monsterSprite_yDelta[currentDir];

  if (this.count > 0)
    this.count--;

  var tileValue = SpriteUtils.getTileValue(this.map, this.x, this.y);

  if (tileValue === -1 || (tileValue === src_tileValues.RIVER && this.count < 500))
    this.frame = 0;

  if (tileValue === src_tileValues.DIRT || tileValue > src_tileValues.WATER_HIGH)
    this._seenLand = true;

  var spriteList = this.spriteManager.getSpriteList();
  for (var i = 0; i < spriteList.length; i++) {
    var s = spriteList[i];

    if (s.frame !== 0 &&
        (s.type === spriteConstants/* SPRITE_AIRPLANE */.LQ || s.type === spriteConstants/* SPRITE_HELICOPTER */.MT ||
         s.type === spriteConstants/* SPRITE_SHIP */.HK || s.type === spriteConstants/* SPRITE_TRAIN */.XT) &&
          SpriteUtils.checkSpriteCollision(this, s))
      s.explodeSprite();
  }

  if (this.frame === 0)
    this._emitEvent(messages.SPRITE_DYING);

  SpriteUtils.destroyMapTile(this.spriteManager, this.map, blockMaps, this.x, this.y);
  this._emitEvent(messages.SPRITE_MOVED, {x: this.worldX, y: this.worldY});
};


// Metadata for image loading
Object.defineProperties(MonsterSprite,
  {ID: MiscUtils.makeConstantDescriptor(5),
   width: MiscUtils.makeConstantDescriptor(48),
   frames: MiscUtils.makeConstantDescriptor(16)});




;// ./src/tornadoSprite.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */








function TornadoSprite(map, spriteManager, x, y) {
  this.init(spriteConstants/* SPRITE_TORNADO */.OR, map, spriteManager, x, y);
  this.width = 48;
  this.height = 48;
  this.xOffset = -24;
  this.yOffset = -40;
  this.frame = 1;
  this.count = 200;
}


BaseSprite(TornadoSprite);


var tornadoSprite_xDelta = [2, 3, 2, 0, -2, -3];
var tornadoSprite_yDelta = [-2, 0, 2, 3, 2, 0];

TornadoSprite.prototype.move = function(spriteCycle, disasterManager, blockMaps) {
  var frame = this.frame;

  // If middle frame, move right or left
  // depending on the flag value
  // If frame = 1, perhaps die based on flag
  // value
  if (frame === 2) {
    if (this.flag)
      frame = 3;
    else
      frame = 1;
  } else {
    if (frame === 1)
      this.flag = 1;
    else
      this.flag = 0;

    frame = 2;
  }

  if (this.count > 0)
    this.count--;

  this.frame = frame;

  var spriteList = this.spriteManager.getSpriteList();
  for (var i = 0; i < spriteList.length; i++) {
    var s = spriteList[i];

    // Explode vulnerable sprites
    if (s.frame !== 0 &&
        (s.type === spriteConstants/* SPRITE_AIRPLANE */.LQ || s.type === spriteConstants/* SPRITE_HELICOPTER */.MT ||
         s.type === spriteConstants/* SPRITE_SHIP */.HK || s.type === spriteConstants/* SPRITE_TRAIN */.XT) &&
      SpriteUtils.checkSpriteCollision(this, s)) {
      s.explodeSprite();
    }
  }

  frame = random.Random.getRandom(5);
  this.x += tornadoSprite_xDelta[frame];
  this.y += tornadoSprite_yDelta[frame];

  if (this.spriteNotInBounds())
    this.frame = 0;

  if (this.count !== 0 && random.Random.getRandom(500) === 0)
    this.frame = 0;

  if (this.frame === 0)
    this._emitEvent(messages.SPRITE_DYING);

  SpriteUtils.destroyMapTile(this.spriteManager, this.map, blockMaps, this.x, this.y);
  this._emitEvent(messages.SPRITE_MOVED, {x: this.worldX, y: this.worldY});
};


// Metadata for image loading
Object.defineProperties(TornadoSprite,
  {ID: MiscUtils.makeConstantDescriptor(6),
   width: MiscUtils.makeConstantDescriptor(48),
   frames: MiscUtils.makeConstantDescriptor(3)});




;// ./src/trainSprite.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */









function TrainSprite(map, spriteManager, x, y) {
  this.init(spriteConstants/* SPRITE_TRAIN */.XT, map,
            spriteManager, x, y);
  this.width = 32;
  this.height = 32;
  this.xOffset = -16;
  this.yOffset = -16;
  this.frame = 1;
  this.dir = 4;
}


BaseSprite(TrainSprite);


var trainSprite_tileDeltaX = [  0, 16, 0, -16];
var trainSprite_tileDeltaY = [-16, 0, 16, 0 ];
var trainSprite_xDelta = [  0, 4, 0, -4, 0];
var trainSprite_yDelta = [ -4, 0, 4, 0, 0];

var TrainPic2 = [ 1, 2, 1, 2, 5];

// Frame values
var NORTHSOUTH = 1;
var EASTWEST = 2;
var NWSE = 3;
var NESW = 4;
var UNDERWATER = 5;

// Direction values
var NORTH = 0;
var EAST = 1;
var SOUTH = 2;
var WEST = 3;
var trainSprite_CANTMOVE = 4;

TrainSprite.prototype.move = function(spriteCycle, disasterManager, blockMaps) {
  // Trains can only move in the 4 cardinal directions
  // Over the course of 4 frames, we move through a tile, so
  // ever fourth frame, we try to find a direction to move in
  // (excluding the opposite direction from the current direction
  // of travel). If there is no possible direction found, our direction
  // is set to CANTMOVE. (Thus, if we're in a dead end, we can start heading
  // backwards next time round). If we fail to find a destination after 2 attempts,
  // we die.

  if (this.frame === NWSE || this.frame === NESW)
    this.frame = TrainPic2[this.dir];

  this.x += trainSprite_xDelta[this.dir];
  this.y += trainSprite_yDelta[this.dir];

  // Find a new direction.
  if ((spriteCycle & 3) === 0) {
    // Choose a random starting point for our search
    var dir = random.Random.getRandom16() & 3;

    for (var i = dir; i < dir + 4; i++) {
      var dir2 = i & 3;

      if (this.dir !== trainSprite_CANTMOVE) {
        // Avoid the opposite direction
        if (dir2 === ((this.dir + 2) & 3))
            continue;
      }

      var tileValue = SpriteUtils.getTileValue(this.map, this.x + trainSprite_tileDeltaX[dir2], this.y + trainSprite_tileDeltaY[dir2]);

      if ((tileValue >= src_tileValues.RAILBASE && tileValue <= src_tileValues.LASTRAIL) ||
          tileValue === src_tileValues.RAILVPOWERH || tileValue === src_tileValues.RAILHPOWERV) {
        if (this.dir !== dir2 && this.dir !== trainSprite_CANTMOVE) {
          if (this.dir + dir2 === WEST)
            this.frame = NWSE;
          else
            this.frame = NESW;
        } else {
          this.frame = TrainPic2[dir2];
        }

        if (tileValue === src_tileValues.HRAIL || tileValue === src_tileValues.VRAIL)
          this.frame = UNDERWATER;

        this.dir = dir2;
        return;
      }
    }

    // Nowhere to go. Die.
    if (this.dir === trainSprite_CANTMOVE) {
      this.frame = 0;
      return;
    }

    // We didn't find a direction this time. We'll try the opposite
    // next time around
    this.dir = trainSprite_CANTMOVE;
  }
};


TrainSprite.prototype.explodeSprite = function() {
  this.frame = 0;
  this.spriteManager.makeExplosionAt(this.x, this.y);
  this._emitEvent(messages.TRAIN_CRASHED, {showable: true, x: this.worldX, y: this.worldY});
};


// Metadata for image loading
Object.defineProperties(TrainSprite,
  {ID: MiscUtils.makeConstantDescriptor(1),
   width: MiscUtils.makeConstantDescriptor(32),
   frames: MiscUtils.makeConstantDescriptor(5)});




;// ./src/spriteManager.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */
















var SpriteManager = EventEmitter(function(map) {
  this.spriteList = [];
  this.map = map;
  this.spriteCycle = 0;
});


SpriteManager.prototype.getSprite = function(type) {
  var filteredList = this.spriteList.filter(function (s) {
    return s.frame !== 0 && s.type === type;
  });

  if (filteredList.length === 0)
    return null;

  return filteredList[0];
};


SpriteManager.prototype.getSpriteList = function() {
  return this.spriteList.slice();
};


SpriteManager.prototype.getSpritesInView = function(startX, startY, pixelWidth, pixelHeight) {
  var sprites = [];
  startX = SpriteUtils.worldToPix(startX);
  startY = SpriteUtils.worldToPix(startY);
  var lastX = startX + pixelWidth;
  var lastY = startY + pixelHeight;

  return this.spriteList.filter(function(s) {
    var spriteLeft = s.x + s.xOffset;
    var spriteTop = s.y + s.yOffset;
    var spriteRight = s.x + s.xOffset + s.width;
    var spriteBottom = s.y + s.yOffset + s.width;

    var leftInBounds = spriteLeft >= startX && spriteLeft < lastX;
    var rightInBounds = spriteRight >= startX && spriteRight < lastX;
    var topInBounds = spriteTop >= startY && spriteTop < lastY;
    var bottomInBounds = spriteBottom >= startY && spriteBottom < lastY;

    return (leftInBounds || rightInBounds) && (topInBounds || bottomInBounds);
  });
};


SpriteManager.prototype.moveObjects = function(simData) {
  var disasterManager = simData.disasterManager;
  var blockMaps = simData.blockMaps;

  this.spriteCycle += 1;

  var list = this.spriteList.slice();

  for (var i = 0, l = list.length; i < l; i++) {
    var sprite = list[i];

    if (sprite.frame === 0)
      continue;

    sprite.move(this.spriteCycle, disasterManager, blockMaps);
  }

  this.pruneDeadSprites();
};


SpriteManager.prototype.makeSprite = function(type, x, y) {
  var newSprite = new constructors[type](this.map, this, x, y);

  // Listen for crashes
  for (var i = 0, l = messages.CRASHES.length; i < l; i++)
    newSprite.addEventListener(messages.CRASHES[i], MiscUtils.reflectEvent.bind(this, messages.CRASHES[i]));

  if (type == spriteConstants/* SPRITE_HELICOPTER */.MT)
    newSprite.addEventListener(messages.HEAVY_TRAFFIC, MiscUtils.reflectEvent.bind(this, messages.HEAVY_TRAFFIC));

  this.spriteList.push(newSprite);
  return newSprite;
};


SpriteManager.prototype.makeTornado = function() {
  var sprite = this.getSprite(spriteConstants/* SPRITE_TORNADO */.OR);
  if (sprite !== null) {
    sprite.count = 200;
    this._emitEvent(messages.TORNADO_SIGHTED, {trackable: true, x: sprite.worldX, y: sprite.worldY, sprite: sprite});
    return;
  }

  var x = random.Random.getRandom(SpriteUtils.worldToPix(this.map.width) - 800) + 400;
  var y = random.Random.getRandom(SpriteUtils.worldToPix(this.map.height) - 200) + 100;

  sprite = this.makeSprite(spriteConstants/* SPRITE_TORNADO */.OR, x, y);
  this._emitEvent(messages.TORNADO_SIGHTED, {trackable: true, x: sprite.worldX, y: sprite.worldY, sprite: sprite});
};


SpriteManager.prototype.makeExplosion = function(x, y) {
  if (this.map.testBounds(x, y))
    this.makeExplosionAt(SpriteUtils.worldToPix(x), SpriteUtils.worldToPix(y));
};


SpriteManager.prototype.makeExplosionAt = function(x, y) {
  this.makeSprite(spriteConstants/* SPRITE_EXPLOSION */.Ev, x, y);
};


SpriteManager.prototype.generatePlane = function(x, y) {
  if (this.getSprite(spriteConstants/* SPRITE_AIRPLANE */.LQ) !== null)
    return;

  this.makeSprite(spriteConstants/* SPRITE_AIRPLANE */.LQ,
                  SpriteUtils.worldToPix(x),
                  SpriteUtils.worldToPix(y));
};


SpriteManager.prototype.generateTrain = function(census, x, y) {
  if (census.totalPop > 10 &&
      this.getSprite(spriteConstants/* SPRITE_TRAIN */.XT) === null &&
      random.Random.getRandom(25) === 0)
    this.makeSprite(spriteConstants/* SPRITE_TRAIN */.XT,
                    SpriteUtils.worldToPix(x) + 8,
                    SpriteUtils.worldToPix(y) + 8);
};


SpriteManager.prototype.generateShip = function() {
  // XXX This code is borked. The map generator will never
  // place a channel tile on the edges of the map
  var x,y;

  if (random.Random.getChance(3)) {
    for (x = 4; x < this.map.width - 2; x++) {
      if (this.map.getTileValue(x, 0) === src_tileValues.CHANNEL)  {
        this.makeShipHere(x, 0);
        return;
      }
    }
  }

  if (random.Random.getChance(3)) {
    for (y = 1; y < this.map.height - 2; y++) {
      if (this.map.getTileValue(0, y) === src_tileValues.CHANNEL)  {
        this.makeShipHere(0, y);
        return;
      }
    }
  }

  if (random.Random.getChance(3)) {
    for (x = 4; x < this.map.width - 2; x++) {
      if (this.map.getTileValue(x, this.map.height - 1) === src_tileValues.CHANNEL)  {
        this.makeShipHere(x, this.map.height - 1);
        return;
      }
    }
  }

  if (random.Random.getChance(3)) {
    for (y = 1; y < this.map.height - 2; y++) {
      if (this.map.getTileValue(this.map.width - 1, y) === src_tileValues.CHANNEL)  {
        this.makeShipHere(this.map.width - 1, y);
        return;
      }
    }
  }
};


SpriteManager.prototype.getBoatDistance = function(x, y) {
  var dist = 99999;
  var pixelX = SpriteUtils.worldToPix(x) + 8;
  var pixelY = SpriteUtils.worldToPix(y) + 8;

  for (var i = 0, l = this.spriteList.length; i < l; i++) {
    var sprite = this.spriteList[i];
    if (sprite.type === spriteConstants/* SPRITE_SHIP */.HK && sprite.frame !== 0) {
      var sprDist = Math.abs(sprite.x - pixelX) + Math.abs(sprite.y - pixelY);

      dist = Math.min(dist, sprDist);
    }
  }

  return dist;
};


SpriteManager.prototype.makeShipHere = function(x, y) {
  this.makeSprite(spriteConstants/* SPRITE_SHIP */.HK,
                  SpriteUtils.worldToPix(x),
                  SpriteUtils.worldToPix(y));
};


SpriteManager.prototype.generateCopter = function(x, y) {
  if (this.getSprite(spriteConstants/* SPRITE_HELICOPTER */.MT) !== null)
    return;

  this.makeSprite(spriteConstants/* SPRITE_HELICOPTER */.MT,
                  SpriteUtils.worldToPix(x),
                  SpriteUtils.worldToPix(y));
};


SpriteManager.prototype.makeMonsterAt = function(x, y) {
  var sprite = this.makeSprite(spriteConstants/* SPRITE_MONSTER */.bn,
                  SpriteUtils.worldToPix(x),
                  SpriteUtils.worldToPix(y));
  this._emitEvent(messages.MONSTER_SIGHTED, {trackable: true, x: x, y: y, sprite: sprite});
};


SpriteManager.prototype.makeMonster = function() {
  var sprite = this.getSprite(spriteConstants/* SPRITE_MONSTER */.bn);
  if (sprite !== null) {
    sprite.soundCount = 1;
    sprite.count = 1000;
    sprite.destX = SpriteUtils.worldToPix(this.map.pollutionMaxX);
    sprite.destY = SpriteUtils.worldToPix(this.map.pollutionMaxY);
  }

  var done = 0;
  for (var i = 0; i < 300; i++)  {
    var x = random.Random.getRandom(this.map.width - 20) + 10;
    var y = random.Random.getRandom(this.map.height - 10) + 5;

    var tile = this.map.getTile(x, y);
    if (tile.getValue() === src_tileValues.RIVER) {
      this.makeMonsterAt(x, y);
      done = 1;
      break;
    }
  }

  if (done === 0)
    this.makeMonsterAt(60, 50);
};


SpriteManager.prototype.pruneDeadSprites = function(type) {
  this.spriteList = this.spriteList.filter(function (s) {
    return s.frame !== 0;
  });
};


var constructors = {};
constructors[spriteConstants/* SPRITE_TRAIN */.XT] = TrainSprite;
constructors[spriteConstants/* SPRITE_SHIP */.HK] = BoatSprite;
constructors[spriteConstants/* SPRITE_MONSTER */.bn] = MonsterSprite;
constructors[spriteConstants/* SPRITE_HELICOPTER */.MT] = CopterSprite;
constructors[spriteConstants/* SPRITE_AIRPLANE */.LQ] = AirplaneSprite;
constructors[spriteConstants/* SPRITE_TORNADO */.OR] = TornadoSprite;
constructors[spriteConstants/* SPRITE_EXPLOSION */.Ev] = ExplosionSprite;




;// ./src/stadia.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */




var emptyStadiumFound = function(map, x, y, simData) {
  simData.census.stadiumPop += 1;

  if (map.getTile(x, y).isPowered()) {
    // Occasionally start the big game
    if (((simData.cityTime + x + y) & 31) === 0) {
      map.putZone(x, y, src_tileValues.FULLSTADIUM, 4);
      map.addTileFlags(x, y, src_tileFlags.POWERBIT);
      map.setTile(x + 1, y, src_tileValues.FOOTBALLGAME1, src_tileFlags.ANIMBIT);
      map.setTile(x + 1, y + 1, src_tileValues.FOOTBALLGAME2, src_tileFlags.ANIMBIT);
    }
  }
};


var fullStadiumFound = function(map, x, y, simData) {
  simData.census.stadiumPop += 1;
  var isPowered = map.getTile(x, y).isPowered();

  if (((simData.cityTime + x + y) & 7) === 0) {
    map.putZone(x, y, src_tileValues.STADIUM, 4);
    if (isPowered)
      map.addTileFlags(x, y, src_tileFlags.POWERBIT);
  }
};


var Stadia = {
  registerHandlers: function(mapScanner, repairManager) {
    mapScanner.addAction(src_tileValues.STADIUM, emptyStadiumFound);
    mapScanner.addAction(src_tileValues.FULLSTADIUM, fullStadiumFound);
    repairManager.addAction(src_tileValues.STADIUM, 15, 4);
  }
};




;// ./src/transport.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */







var railFound = function(map, x, y, simData) {
  simData.census.railTotal += 1;
  simData.spriteManager.generateTrain(simData.census, x, y);

  if (simData.budget.shouldDegradeRoad()) {
    if (random.Random.getChance(511)) {
      var currentTile = map.getTile(x, y);

      // Don't degrade tiles with power lines
      if (currentTile.isConductive())
        return;

      if (simData.budget.roadEffect < (random.Random.getRandom16() & 31)) {
        var mapValue = currentTile.getValue();

        // Replace bridge tiles with water, otherwise rubble
        if (mapValue < src_tileValues.RAILBASE + 2)
          map.setTile(x, y, src_tileValues.RIVER, 0);
        else
          map.setTo(x, y, TileUtils.randomRubble());
      }
    }
  }
};


var airportFound = function(map, x, y, simData) {
  simData.census.airportPop += 1;

  var tile = map.getTile(x, y);
  if (tile.isPowered()) {
    if (map.getTileValue(x + 1, y - 1) === src_tileValues.RADAR)
      map.setTile(x + 1, y - 1, src_tileValues.RADAR0, src_tileFlags.CONDBIT | src_tileFlags.ANIMBIT | src_tileFlags.BURNBIT);

    if (random.Random.getRandom(5) === 0) {
      simData.spriteManager.generatePlane(x, y);
      return;
    }

    if (random.Random.getRandom(12) === 0)
      simData.spriteManager.generateCopter(x, y);
  } else {
      map.setTile(x + 1, y - 1, src_tileValues.RADAR, src_tileFlags.CONDBIT | src_tileFlags.BURNBIT);
  }
};


var portFound = function(map, x, y, simData) {
  simData.census.seaportPop += 1;

  var tile = map.getTile(x, y);
  if (tile.isPowered() &&
      simData.spriteManager.getSprite(spriteConstants/* SPRITE_SHIP */.HK) === null)
    simData.spriteManager.generateShip();
};


var Transport = {
  registerHandlers: function(mapScanner, repairManager) {
    mapScanner.addAction(TileUtils.isRail, railFound);
    mapScanner.addAction(src_tileValues.PORT, portFound);
    mapScanner.addAction(src_tileValues.AIRPORT, airportFound);

    repairManager.addAction(src_tileValues.PORT, 15, 4);
    repairManager.addAction(src_tileValues.AIRPORT, 7, 6);
  }
};




;// ./src/valves.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */





var Valves = EventEmitter(function () {
  this.resValve = 0;
  this.comValve = 0;
  this.indValve = 0;
  this.resCap = false;
  this.comCap = false;
  this.indCap = false;
});


var RES_VALVE_RANGE = 2000;
var COM_VALVE_RANGE = 1500;
var IND_VALVE_RANGE = 1500;


var taxTable = [
  200, 150, 120, 100, 80, 50, 30, 0, -10, -40, -100,
  -150, -200, -250, -300, -350, -400, -450, -500, -550, -600];
var extMarketParamTable = [1.2, 1.1, 0.98];

Valves.prototype.save = function(saveData) {
  saveData.resValve = this.resValve;
  saveData.comValve = this.comValve;
  saveData.indValve = this.indValve;
};


Valves.prototype.load = function(saveData) {
  this.resValve = saveData.resValve;
  this.comValve = saveData.comValve;
  this.indValve = saveData.indValve;

  this._emitEvent(messages.VALVES_UPDATED);
};


Valves.prototype.setValves = function(gameLevel, census, budget) {
  var resPopDenom = 8;
  var birthRate = 0.02;
  var labourBaseMax = 1.3;
  var internalMarketDenom = 3.7;
  var projectedIndPopMin = 5.0;
  var resRatioDefault = 1.3;
  var resRatioMax = 2;
  var comRatioMax = 2;
  var indRatioMax = 2;
  var taxMax = 20;
  var taxTableScale = 600;
  var employment, labourBase;

  // Residential zones scale their population index when reporting it to the census
  var normalizedResPop = census.resPop / resPopDenom;
  census.totalPop = Math.round(normalizedResPop + census.comPop + census.indPop);

  // A lack of developed commercial and industrial zones means there are no employment opportunities, which constrain
  // growth. (This might hurt initially if, for example, the player lays out an initial grid, as the residential zones
  // will likely develop first, so the residential valve will immediately crater).
  if (census.resPop > 0)
    employment = (census.comHist10[1] + census.indHist10[1]) / normalizedResPop;
  else
    employment = 1;

  // Given the employment rate, calculate expected migration, add in births, and project the new population.
  var migration = normalizedResPop * (employment - 1);
  var births = normalizedResPop * birthRate;
  var projectedResPop = normalizedResPop + migration + births;

  // Examine how many zones require workers
  labourBase = census.comHist10[1] + census.indHist10[1];
  if (labourBase > 0.0)
    labourBase = census.resHist10[1] / labourBase;
  else
    labourBase = 1;
  labourBase = MiscUtils.clamp(labourBase, 0.0, labourBaseMax);

  // Project future industry and commercial needs, taking into account available labour, and competition from
  // other global cities
  var internalMarket = (normalizedResPop + census.comPop + census.indPop) / internalMarketDenom;
  var projectedComPop = internalMarket * labourBase;
  var projectedIndPop = census.indPop * labourBase * extMarketParamTable[gameLevel];
  projectedIndPop = Math.max(projectedIndPop, projectedIndPopMin);

  // Calculate the expected percentage changes in each population type
  var resRatio;
  if (normalizedResPop > 0)
    resRatio = projectedResPop / normalizedResPop;
  else
    resRatio = resRatioDefault;

  var comRatio;
  if (census.comPop > 0)
    comRatio = projectedComPop / census.comPop;
  else
    comRatio = projectedComPop;

  var indRatio;
  if (census.indPop > 0)
    indRatio = projectedIndPop / census.indPop;
  else
    indRatio = projectedIndPop;

  resRatio = Math.min(resRatio, resRatioMax);
  comRatio = Math.min(comRatio, comRatioMax);
  indRatio = Math.min(indRatio, indRatioMax);

  // Constrain growth according to the tax level.
  var z = Math.min((budget.cityTax + gameLevel), taxMax);
  resRatio = (resRatio - 1) * taxTableScale + taxTable[z];
  comRatio = (comRatio - 1) * taxTableScale + taxTable[z];
  indRatio = (indRatio - 1) * taxTableScale + taxTable[z];

  this.resValve = MiscUtils.clamp(this.resValve + Math.round(resRatio), -RES_VALVE_RANGE, RES_VALVE_RANGE);
  this.comValve = MiscUtils.clamp(this.comValve + Math.round(comRatio), -COM_VALVE_RANGE, COM_VALVE_RANGE);
  this.indValve = MiscUtils.clamp(this.indValve + Math.round(indRatio), -IND_VALVE_RANGE, IND_VALVE_RANGE);

  if (this.resCap && this.resValve > 0)
    this.resValve = 0;

  if (this.comCap && this.comValve > 0)
      this.comValve = 0;

  if (this.indCap && this.indValve > 0)
      this.indValve = 0;

  this._emitEvent(messages.VALVES_UPDATED);
};




;// ./src/simulation.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */

























var Simulation = EventEmitter(function (gameMap, gameLevel, speed, savedGame) {
  this._map = gameMap;
  this.setLevel(gameLevel);
  this.setSpeed(speed);

  this._phaseCycle = 0;
  this._simCycle = 0;
  this._cityTime = 0;
  this._cityPopLast = 0;
  this._messageLast = undefined;
  this._startingYear = 1900;

  // Last date sent to front end
  this._cityYearLast = -1;
  this._cityMonthLast = -1;

  // Last time we relayed a message from PowerManager to the front-end
  this._lastPowerMessage = null;

  // And now, the main cast of characters
  this.evaluation = new Evaluation(this._gameLevel);
  this._valves = new Valves();
  this.budget = new Budget();
  this._census = new Census();
  this._powerManager = new PowerManager(this._map);
  this.spriteManager = new SpriteManager(this._map);
  this._mapScanner = new MapScanner(this._map);
  this._repairManager = new RepairManager(this._map);
  this._traffic = new Traffic(this._map, this.spriteManager);
  this.disasterManager = new DisasterManager(this._map, this.spriteManager, this._gameLevel);

  this.blockMaps = {
    // Holds a "distance score" for the block from the city centre, range  -64 to 64
    cityCentreDistScoreMap: new blockMap/* BlockMap */.Q(this._map.width, this._map.height, 8),

    // Holds a score representing how dangerous an area is, in range 0-250 (larger is worse)
    crimeRateMap: new blockMap/* BlockMap */.Q(this._map.width, this._map.height, 2),

    // A map used to note positions of fire stations during the map scan, range 0-1000
    fireStationMap: new blockMap/* BlockMap */.Q(this._map.width, this._map.height, 8),

    // Holds a value containing a score representing the effect of fire cover in this neighborhood, range 0-1000
    fireStationEffectMap: new blockMap/* BlockMap */.Q(this._map.width, this._map.height, 8),

    // Holds scores representing the land value in the range 0-250
    landValueMap: new blockMap/* BlockMap */.Q(this._map.width, this._map.height, 2),

    // A map used to note positions of police stations during the map scan, range 0-1000
    policeStationMap: new blockMap/* BlockMap */.Q(this._map.width, this._map.height, 8),

    // Holds a value containing a score representing how much crime is dampened in this block, range 0-1000
    policeStationEffectMap: new blockMap/* BlockMap */.Q(this._map.width, this._map.height, 8),

    // Holds a value representing the amount of pollution in a neighbourhood, in the range 0-255
    pollutionDensityMap: new blockMap/* BlockMap */.Q(this._map.width, this._map.height, 2),

    // Holds a value representing population density of a block, in the range 0-510
    populationDensityMap: new blockMap/* BlockMap */.Q(this._map.width, this._map.height, 2),

    // Holds a value representing the rate of growth of a neighbourhood in the range -200 to +200
    rateOfGrowthMap: new blockMap/* BlockMap */.Q(this._map.width, this._map.height, 8),

    // Scores a block on how undeveloped/unspoilt it is, range 0-240
    terrainDensityMap: new blockMap/* BlockMap */.Q(this._map.width, this._map.height, 4),

    // Scores the volume of traffic in this cluster, range 0-240
    trafficDensityMap: new blockMap/* BlockMap */.Q(this._map.width, this._map.height, 2),

    // Temporary maps
    tempMap1: new blockMap/* BlockMap */.Q(this._map.width, this._map.height, 2),
    tempMap2: new blockMap/* BlockMap */.Q(this._map.width, this._map.height, 2),
    tempMap3: new blockMap/* BlockMap */.Q(this._map.width, this._map.height, 4)
  };

  this._clearCensus();

  if (savedGame) {
    this.load(savedGame);
  } else {
    this.budget.setFunds(20000);
    this._census.totalPop = 1;
  }

  this.init();
});


Simulation.prototype.setLevel = function(l) {
  if (l !== Simulation.LEVEL_EASY &&
      l !== Simulation.LEVEL_MED &&
      l !== Simulation.LEVEL_HARD)
    throw new Error('Invalid level!');

  this._gameLevel = l;
};


Simulation.prototype.setSpeed = function(s) {
  if (s !== Simulation.SPEED_PAUSED &&
      s !== Simulation.SPEED_SLOW &&
      s !== Simulation.SPEED_MED &&
      s !== Simulation.SPEED_FAST)
    throw new Error('Invalid speed!');

  this._speed = s;
};


Simulation.prototype.isPaused = function() {
  return this._speed === Simulation.SPEED_PAUSED;
};


var simulation_saveProps = ['_cityTime', '_speed', '_gameLevel'];

Simulation.prototype.save = function(saveData) {
  for (var i = 0, l = simulation_saveProps.length; i < l; i++)
    saveData[simulation_saveProps[i]] = this[simulation_saveProps[i]];

  this._map.save(saveData);
  this.evaluation.save(saveData);
  this._valves.save(saveData);
  this.budget.save(saveData);
  this._census.save(saveData);
};


Simulation.prototype.load = function(saveData) {
  for (var i = 0, l = simulation_saveProps.length; i < l; i++)
    this[simulation_saveProps[i]] = saveData[simulation_saveProps[i]];

  this._map.load(saveData);
  this.evaluation.load(saveData);
  this._valves.load(saveData);
  this.budget.load(saveData);
  this._census.load(saveData);
};


Simulation.prototype.simTick = function() {
  this._simFrame();
  this._updateTime();
  // TODO Graphs
};


Simulation.prototype._simFrame = function() {
  if (this.budget.awaitingValues)
    return;

  // Default to slow speed
  var threshold = 100;

  switch (this._speed) {
    case Simulation.SPEED_PAUSED:
      return;

    case Simulation.SPEED_SLOW:
      // We've already set the threshold correctly
      break;

    case Simulation.SPEED_MED:
      threshold = 50;
      break;

    case Simulation.SPEED_FAST:
      threshold = 10;
      break;

    default:
      console.warn('Unexpected speed ('  + this._speed + '): defaulting to slow');
  }

  var d = new Date();
  if (d - this._lastTickTime < threshold)
    return;

  var simData = this._constructSimData();
  this._simulate(simData);
  this._lastTickTime = new Date();
};


Simulation.prototype._clearCensus = function() {
  this._census.clearCensus();
  this._powerManager.clearPowerStack();
  this.blockMaps.fireStationMap.clear();
  this.blockMaps.policeStationMap.clear();
};


Simulation.prototype._constructSimData = function() {
  return {
    blockMaps: this.blockMaps,
    budget: this.budget,
    census: this._census,
    cityTime: this._cityTime,
    disasterManager: this.disasterManager,
    gameLevel: this._gameLevel,
    repairManager: this._repairManager,
    powerManager: this._powerManager,
    simulator: this,
    spriteManager: this.spriteManager,
    trafficManager: this._traffic,
    valves: this._valves
  };
};


Simulation.prototype.init = function() {
  this._lastTickTime = -1;

  // Add various listeners that we will in turn transmit upwards
  var evaluationEvents = ['CLASSIFICATION_UPDATED', 'POPULATION_UPDATED', 'SCORE_UPDATED'].map(function(m) {
    return messages_namespaceObject[m];
  });
  for (var i = 0, l = evaluationEvents.length; i < l; i++)
    this.evaluation.addEventListener(evaluationEvents[i], MiscUtils.reflectEvent.bind(this, evaluationEvents[i]));

  this._powerManager.addEventListener(messages.NOT_ENOUGH_POWER, function(e) {
    var d = new Date();

    if (this._lastPowerMessage === null || d - this._lastPowerMessage > 1000 * 60 * 2) {
      this._emitEvent(messages.FRONT_END_MESSAGE, {subject: messages.NOT_ENOUGH_POWER});
      this._lastPowerMessage = d;
    }
  }.bind(this));

  this.budget.addEventListener(messages.FUNDS_CHANGED, MiscUtils.reflectEvent.bind(this, messages.FUNDS_CHANGED));
  this.budget.addEventListener(messages.BUDGET_NEEDED, MiscUtils.reflectEvent.bind(this, messages.BUDGET_NEEDED));
  this.budget.addEventListener(messages.NO_MONEY, this._wrapMessage.bind(this, messages.NO_MONEY));

  this._valves.addEventListener(messages.VALVES_UPDATED, this._onValveChange.bind(this));

  for (i = 0, l = messages.DISASTER_MESSAGES.length; i < l; i++) {
    this.spriteManager.addEventListener(messages.DISASTER_MESSAGES[i], this._wrapMessage.bind(this, messages.DISASTER_MESSAGES[i]));
    this.disasterManager.addEventListener(messages.DISASTER_MESSAGES[i], this._wrapMessage.bind(this, messages.DISASTER_MESSAGES[i]));
  }
  for (i = 0, l = messages.CRASHES.length; i < l; i++)
    this.spriteManager.addEventListener(messages.CRASHES[i], this._wrapMessage.bind(this, messages.CRASHES[i]));

  this.spriteManager.addEventListener(messages.HEAVY_TRAFFIC, this._wrapMessage.bind(this, messages.HEAVY_TRAFFIC));

  // Register actions
  Commercial.registerHandlers(this._mapScanner, this._repairManager);
  EmergencyServices.registerHandlers(this._mapScanner, this._repairManager);
  Industrial.registerHandlers(this._mapScanner, this._repairManager);
  MiscTiles.registerHandlers(this._mapScanner, this._repairManager);
  this._powerManager.registerHandlers(this._mapScanner, this._repairManager);
  Road.registerHandlers(this._mapScanner, this._repairManager);
  Residential.registerHandlers(this._mapScanner, this._repairManager);
  Stadia.registerHandlers(this._mapScanner, this._repairManager);
  Transport.registerHandlers(this._mapScanner, this._repairManager);

  var simData = this._constructSimData();
  this._mapScanner.mapScan(0, this._map.width, simData);
  this._powerManager.doPowerScan(this._census);
  BlockMapUtils.pollutionTerrainLandValueScan(this._map, this._census, this.blockMaps);
  BlockMapUtils.crimeScan(this._census, this.blockMaps);
  BlockMapUtils.populationDensityScan(this._map, this.blockMaps);
  BlockMapUtils.fireAnalysis(this.blockMaps);
};


var speedPowerScan = [2, 4, 5];
var speedPollutionTerrainLandValueScan = [2, 7, 17];
var speedCrimeScan = [1, 8, 18];
var speedPopulationDensityScan = [1, 9,19];
var speedFireAnalysis = [1, 10, 20];
var CENSUS_FREQUENCY_10 = 4;
var CENSUS_FREQUENCY_120 = CENSUS_FREQUENCY_10 * 10;
var TAX_FREQUENCY = 48;


var simulate = function(simData) {
  this._phaseCycle &= 15;
  var speedIndex = this._speed - 1;

  switch (this._phaseCycle)  {
    case 0:
      if (++this._simCycle > 1023)
          this._simCycle = 0;

      this._cityTime++;

      if ((this._simCycle & 1) === 0)
        this._valves.setValves(this._gameLevel, this._census, this.budget);

      this._clearCensus();
      break;

    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
      this._mapScanner.mapScan((this._phaseCycle - 1) * this._map.width / 8,
                                this._phaseCycle * this._map.width / 8, simData);
      break;

    case 9:
      if (this._cityTime % CENSUS_FREQUENCY_10 === 0)
        this._census.take10Census(budget);

      if (this._cityTime % CENSUS_FREQUENCY_120 === 0)
        this._census.take120Census(budget);

      if (this._cityTime % TAX_FREQUENCY === 0)  {
        this.budget.collectTax(this._gameLevel, this._census);
        this.evaluation.cityEvaluation(simData);
      }

      break;

    case 10:
      if ((this._simCycle % 5) === 0)
        BlockMapUtils.neutraliseRateOfGrowthMap(simData.blockMaps);

      BlockMapUtils.neutraliseTrafficMap(this.blockMaps);
      this._sendMessages();
      break;

    case 11:
      if ((this._simCycle % speedPowerScan[speedIndex]) === 0)
        this._powerManager.doPowerScan(this._census);
      break;

    case 12:
      if ((this._simCycle % speedPollutionTerrainLandValueScan[speedIndex]) === 0)
        BlockMapUtils.pollutionTerrainLandValueScan(this._map, this._census, this.blockMaps);
      break;

    case 13:
      if ((this._simCycle % speedCrimeScan[speedIndex]) === 0)
        BlockMapUtils.crimeScan(this._census, this.blockMaps);
      break;

    case 14:
      if ((this._simCycle % speedPopulationDensityScan[speedIndex]) === 0)
        BlockMapUtils.populationDensityScan(this._map, this.blockMaps);
      break;

    case 15:
      if ((this._simCycle % speedFireAnalysis[speedIndex]) === 0)
        BlockMapUtils.fireAnalysis(this.blockMaps);

      this.disasterManager.doDisasters(this._census);
      break;
  }

  // Go on the the next phase.
  this._phaseCycle = (this._phaseCycle + 1) & 15;
};


Simulation.prototype._simulate = function(simData) {
  // This is actually a wrapper function that will only be called once, to perform the initial
  // evaluation. Once that has completed, it will supplant itself with the standard "simulate"
  // procedure defined above
  this.evaluation.cityEvaluation(simData);
  this._simulate = simulate;
  this._simulate(simData);
};


Simulation.prototype._wrapMessage = function(message, data) {
  this._emitEvent(messages.FRONT_END_MESSAGE, {subject: message, data: data});
};


Simulation.prototype._sendMessages = function() {
  this._checkGrowth();

  var totalZonePop = this._census.resZonePop + this._census.comZonePop +
                     this._census.indZonePop;
  var powerPop = this._census.nuclearPowerPop + this._census.coalPowerPop;

  switch (this._cityTime & 63) {
    case 1:
      if (Math.floor(totalZonePop / 4) >= this._census.resZonePop)
        this._emitEvent(messages.FRONT_END_MESSAGE, {subject: messages.NEED_MORE_RESIDENTIAL});
      break;

    case 5:
      if (Math.floor(totalZonePop / 8) >= this._census.comZonePop)
        this._emitEvent(messages.FRONT_END_MESSAGE, {subject: messages.NEED_MORE_COMMERCIAL});
      break;

    case 10:
      if (Math.floor(totalZonePop / 8) >= this._census.indZonePop)
        this._emitEvent(messages.FRONT_END_MESSAGE, {subject: messages.NEED_MORE_INDUSTRIAL});
      break;

    case 14:
      if (totalZonePop > 10 && totalZonePop * 2 > this._census.roadTotal)
        this._emitEvent(messages.FRONT_END_MESSAGE, {subject: messages.NEED_MORE_ROADS});
      break;

    case 18:
      if (totalZonePop > 50 && totalZonePop > this._census.railTotal)
        this._emitEvent(messages.FRONT_END_MESSAGE, {subject: messages.NEED_MORE_RAILS});
      break;

    case 22:
      if (totalZonePop > 10 && powerPop === 0)
        this._emitEvent(messages.FRONT_END_MESSAGE, {subject: messages.NEED_ELECTRICITY});
      break;

    case 26:
      if (this._census.resPop > 500 && this._census.stadiumPop === 0) {
        this._emitEvent(messages.FRONT_END_MESSAGE, {subject: messages.NEED_STADIUM});
        this._valves.resCap = true;
      } else {
        this._valves.resCap = false;
      }
      break;

    case 28:
      if (this._census.indPop > 70 && this._census.seaportPop === 0) {
          this._emitEvent(messages.FRONT_END_MESSAGE, {subject: messages.NEED_SEAPORT});
        this._valves.indCap = true;
      } else {
        this._valves.indCap = false;
      }
      break;

    case 30:
      if (this._census.comPop > 100 && this._census.airportPop === 0) {
          this._emitEvent(messages.FRONT_END_MESSAGE, {subject: messages.NEED_AIRPORT});
        this._valves.comCap = true;
      } else {
        this._valves.comCap = false;
      }
      break;

    case 32:
      var zoneCount = this._census.unpoweredZoneCount + this._census.poweredZoneCount;
      if (zoneCount > 0) {
        if (this._census.poweredZoneCount / zoneCount < 0.7 && powerPop > 0) {
          var d = new Date();
          if (this._lastPowerMessage === null || d - this._lastPowerMessage > 1000 * 60 * 2) {
            this._emitEvent(messages.FRONT_END_MESSAGE, {subject: messages.BLACKOUTS_REPORTED});
            this._lastPowerMessage = d;
          }
        }
      }
      break;

    case 35:
      if (this._census.pollutionAverage > 60)
        this._emitEvent(messages.FRONT_END_MESSAGE,
                       {subject: messages.HIGH_POLLUTION, data: {x: this._map.pollutionMaxX, y: this._map.pollutionMaxY}});
      break;

    case 42:
      if (this._census.crimeAverage > 100)
        this._emitEvent(messages.FRONT_END_MESSAGE, {subject: messages.HIGH_CRIME});
      break;

    case 45:
      if (this._census.totalPop > 60 && this._census.fireStationPop === 0)
        this._emitEvent(messages.FRONT_END_MESSAGE, {subject: messages.NEED_FIRE_STATION});
      break;

    case 48:
      if (this._census.totalPop > 60 && this._census.policeStationPop === 0)
        this._emitEvent(messages.FRONT_END_MESSAGE, {subject: messages.NEED_POLICE_STATION});
      break;

    case 51:
      if (this.budget.cityTax > 12)
        this._emitEvent(messages.FRONT_END_MESSAGE, {subject: messages.TAX_TOO_HIGH});
      break;

    case 54:
      if (this.budget.roadEffect < Math.floor(5 * this.budget.MAX_ROAD_EFFECT / 8) && this._census.roadTotal > 30)
        this._emitEvent(messages.FRONT_END_MESSAGE, {subject: messages.ROAD_NEEDS_FUNDING});
      break;

    case 57:
      if (this.budget.fireEffect < Math.floor(7 * this.budget.MAX_FIRE_STATION_EFFECT / 10) && this._census.totalPop > 20)
        this._emitEvent(messages.FRONT_END_MESSAGE, {subject: messages.FIRE_STATION_NEEDS_FUNDING});
      break;

    case 60:
      if (this.budget.policeEffect < Math.floor(7 * this.budget.MAX_POLICE_STATION_EFFECT / 10) && this._census.totalPop > 20)
        this._emitEvent(messages.FRONT_END_MESSAGE, {subject: messages.POLICE_NEEDS_FUNDING});
      break;

  case 63:
    if (this._census.trafficAverage > 60)
      this._emitEvent(messages.FRONT_END_MESSAGE, {subject: messages.TRAFFIC_JAMS});
    break;
  }
};


Simulation.prototype._checkGrowth = function() {
  if ((this._cityTime & 3) !== 0)
    return;

  var message = '';
  var cityPop = this.evaluation.getPopulation(this._census);

  if (cityPop !== this._cityPopLast) {
    var lastClass = this.evaluation.getCityClass(this._cityPopLast);
    var newClass = this.evaluation.getCityClass(cityPop);

    if (lastClass !== newClass) {
      switch (newClass) {
        case Evaluation.CC_VILLAGE:
          // Don't mention it.
          break;

        case Evaluation.CC_TOWN:
          message = messages.REACHED_TOWN;
          break;

        case Evaluation.CC_CITY:
          message = messages.REACHED_CITY;
          break;

        case Evaluation.CC_CAPITAL:
          message = messages.REACHED_CAPITAL;
            break;

        case Evaluation.CC_METROPOLIS:
          message = messages.REACHED_METROPOLIS;
          break;

        case Evaluation.CC_MEGALOPOLIS:
          message = messages.REACHED_MEGALOPOLIS;
          break;

        default:
          break;
      }
    }
  }

  if (message !== '' && message !== this._messageLast) {
    this._emitEvent(messages.FRONT_END_MESSAGE, {subject: message});
    this._messageLast = message;
  }

  this._cityPopLast = cityPop;
};


Simulation.prototype._onValveChange  = function() {
  this._resLast = this._valves.resValve;
  this._comLast = this._valves.comValve;
  this._indLast = this._valves.indValve;

  this._emitEvent(messages.VALVES_UPDATED, {residential: this._valves.resValve,
                                            commercial: this._valves.comValve,
                                            industrial: this._valves.indValve});
};


Simulation.prototype.getDate = function() {
  var year = Math.floor(this._cityTime / 48) + this._startingYear;
  var month = Math.floor(this._cityTime % 48) >> 2;
  return {month: month, year: year};
};


Simulation.prototype._setYear = function(year) {
  if (year < this._startingYear)
    year = this._startingYear;

  year = (year - this._startingYear) - (this._cityTime / 48);
  this._cityTime += year * 48;
  this._updateTime();
};


Simulation.prototype._updateTime = function() {
  var megalinium = 1000000;
  var cityYear = Math.floor(this._cityTime / 48) + this._startingYear;
  var cityMonth = Math.floor(this._cityTime % 48) >> 2;

  if (cityYear >= megalinium) {
    this.setYear(startingYear);
    return;
  }

  if (this._cityYearLast !== cityYear || this._cityMonthLast !== cityMonth) {
    this._cityYearLast = cityYear;
    this._cityMonthLast = cityMonth;
    this._emitEvent(messages.DATE_UPDATED, {month: cityMonth, year: cityYear});
  }
};


Object.defineProperties(Simulation,
  {LEVEL_EASY: MiscUtils.makeConstantDescriptor(0),
  LEVEL_MED:  MiscUtils.makeConstantDescriptor(1),
  LEVEL_HARD: MiscUtils.makeConstantDescriptor(2),
  SPEED_PAUSED: MiscUtils.makeConstantDescriptor(0),
  SPEED_SLOW:  MiscUtils.makeConstantDescriptor(1),
  SPEED_MED: MiscUtils.makeConstantDescriptor(2),
  SPEED_FAST: MiscUtils.makeConstantDescriptor(3),
});




;// ./src/text.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */





// TODO Some kind of rudimentary L20N based on navigator.language?

// Query tool strings
var densityStrings = ['Low', 'Medium', 'High', 'Very High'];
var landValueStrings = ['Slum', 'Lower Class', 'Middle Class', 'High'];
var crimeStrings = ['Safe', 'Light', 'Moderate', 'Dangerous'];
var pollutionStrings = ['None', 'Moderate', 'Heavy', 'Very Heavy'];
var rateStrings = ['Declining', 'Stable', 'Slow Growth', 'Fast Growth'];
var zoneTypes = ['Clear', 'Water', 'Trees', 'Rubble', 'Flood', 'Radioactive Waste',
                 'Fire', 'Road', 'Power', 'Rail', 'Residential', 'Commercial',
                 'Industrial', 'Seaport', 'Airport', 'Coal Power', 'Fire Department',
                 'Police Department', 'Stadium', 'Nuclear Power', 'Draw Bridge',
                 'Radar Dish', 'Fountain', 'Industrial', 'Steelers 38  Bears 3',
                 'Draw Bridge', 'Ur 238'];

// Evaluation window
var gameLevel = {};
gameLevel['' + Simulation.LEVEL_EASY] = 'Easy';
gameLevel['' + Simulation.LEVEL_MED] = 'Medium';
gameLevel['' + Simulation.LEVEL_HARD] = 'Hard';

var cityClass = {};
cityClass[Evaluation.CC_VILLAGE] = 'VILLAGE';
cityClass[Evaluation.CC_TOWN] = 'TOWN';
cityClass[Evaluation.CC_CITY] = 'CITY';
cityClass[Evaluation.CC_CAPITAL] = 'CAPITAL';
cityClass[Evaluation.CC_METROPOLIS] = 'METROPOLIS';
cityClass[Evaluation.CC_MEGALOPOLIS] = 'MEGALOPOLIS';

var problems = {};
problems[Evaluation.CRIME] = 'Crime';
problems[Evaluation.POLLUTION] = 'Pollution';
problems[Evaluation.HOUSING] = 'Housing';
problems[Evaluation.TAXES] = 'Taxes';
problems[Evaluation.TRAFFIC] = 'Traffic';
problems[Evaluation.UNEMPLOYMENT] = 'Unemployment';
problems[Evaluation.FIRE] = 'Fire';

// months
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Tool strings
var toolMessages = {
  noMoney: 'Insufficient funds to build that',
  needsDoze: 'Area must be bulldozed first'
};

// Message strings
var neutralMessages = {};
neutralMessages[messages.FIRE_STATION_NEEDS_FUNDING] = true;
neutralMessages[messages.NEED_AIRPORT] = true;
neutralMessages[messages.NEED_FIRE_STATION] = true;
neutralMessages[messages.NEED_ELECTRICITY] = true;
neutralMessages[messages.NEED_MORE_INDUSTRIAL] = true;
neutralMessages[messages.NEED_MORE_COMMERCIAL] = true;
neutralMessages[messages.NEED_MORE_RESIDENTIAL] = true;
neutralMessages[messages.NEED_MORE_RAILS] = true;
neutralMessages[messages.NEED_MORE_ROADS] = true;
neutralMessages[messages.NEED_POLICE_STATION] = true;
neutralMessages[messages.NEED_SEAPORT] = true;
neutralMessages[messages.NEED_STADIUM] = true;
neutralMessages[messages.ROAD_NEEDS_FUNDING] = true;
neutralMessages[messages.POLICE_NEEDS_FUNDING] = true;
neutralMessages[messages.WELCOME] = true;

var badMessages = {};
badMessages[messages.BLACKOUTS_REPORTED] = true;
badMessages[messages.EARTHQUAKE] = true;
badMessages[messages.EXPLOSION_REPORTED] = true;
badMessages[messages.FLOODING_REPORTED] = true;
badMessages[messages.FIRE_REPORTED] = true;
badMessages[messages.HEAVY_TRAFFIC] = true;
badMessages[messages.HELICOPTER_CRASHED] = true;
badMessages[messages.HIGH_CRIME] = true;
badMessages[messages.HIGH_POLLUTION] = true;
badMessages[messages.MONSTER_SIGHTED] = true;
badMessages[messages.NO_MONEY] = true;
badMessages[messages.NOT_ENOUGH_POWER] = true;
badMessages[messages.NUCLEAR_MELTDOWN] = true;
badMessages[messages.PLANE_CRASHED] = true;
badMessages[messages.SHIP_CRASHED] = true;
badMessages[messages.TAX_TOO_HIGH] = true;
badMessages[messages.TORNADO_SIGHTED] = true;
badMessages[messages.TRAFFIC_JAMS] = true;
badMessages[messages.TRAIN_CRASHED] = true;

var goodMessages = {};
goodMessages[messages.REACHED_CAPITAL] = true;
goodMessages[messages.REACHED_CITY] = true;
goodMessages[messages.REACHED_MEGALOPOLIS] = true;
goodMessages[messages.REACHED_METROPOLIS] = true;
goodMessages[messages.REACHED_TOWN] = true;

var messageText = {};
messageText[messages.FIRE_STATION_NEEDS_FUNDING] = 'Fire departments need funding';
messageText[messages.NEED_AIRPORT] = 'Commerce requires an Airport';
messageText[messages.NEED_FIRE_STATION] = 'Citizens demand a Fire Department';
messageText[messages.NEED_ELECTRICITY] = 'Build a Power Plant';
messageText[messages.NEED_MORE_INDUSTRIAL] = 'More industrial zones needed';
messageText[messages.NEED_MORE_COMMERCIAL] = 'More commercial zones needed';
messageText[messages.NEED_MORE_RESIDENTIAL] = 'More residential zones needed';
messageText[messages.NEED_MORE_RAILS] = 'Inadequate rail system';
messageText[messages.NEED_MORE_ROADS] = 'More roads required';
messageText[messages.NEED_POLICE_STATION] = 'Citizens demand a Police Department';
messageText[messages.NEED_SEAPORT] = 'Industry requires a Sea Port';
messageText[messages.NEED_STADIUM] = 'Residents demand a Stadium';
messageText[messages.ROAD_NEEDS_FUNDING] = 'Roads deteriorating, due to lack of funds';
messageText[messages.POLICE_NEEDS_FUNDING] = 'Police departments need funding';
messageText[messages.WELCOME] = 'Welcome to micropolisJS';
messageText[messages.BLACKOUTS_REPORTED] = 'Brownouts, build another Power Plant';
messageText[messages.EARTHQUAKE] = 'Major earthquake reported !!';
messageText[messages.EXPLOSION_REPORTED] = 'Explosion detected ';
messageText[messages.FLOODING_REPORTED] = 'Flooding reported !';
messageText[messages.FIRE_REPORTED] = 'Fire reported ';
messageText[messages.HEAVY_TRAFFIC] = 'Heavy Traffic reported';
messageText[messages.HELICOPTER_CRASHED] = 'A helicopter crashed ';
messageText[messages.HIGH_CRIME] = 'Crime very high';
messageText[messages.HIGH_POLLUTION] = 'Pollution very high';
messageText[messages.MONSTER_SIGHTED] = 'A Monster has been sighted !';
messageText[messages.NO_MONEY] = 'YOUR CITY HAS GONE BROKE';
messageText[messages.NOT_ENOUGH_POWER] = 'Blackouts reported: insufficient power capacity';
messageText[messages.NUCLEAR_MELTDOWN] = 'A Nuclear Meltdown has occurred !!';
messageText[messages.PLANE_CRASHED] = 'A plane has crashed ';
messageText[messages.SHIP_CRASHED] = 'Shipwreck reported ';
messageText[messages.TAX_TOO_HIGH] = 'Citizens upset. The tax rate is too high';
messageText[messages.TORNADO_SIGHTED] = 'Tornado reported !';
messageText[messages.TRAFFIC_JAMS] = 'Frequent traffic jams reported';
messageText[messages.TRAIN_CRASHED] = 'A train crashed ';
messageText[messages.REACHED_CAPITAL] = 'Population has reached 50,000';
messageText[messages.REACHED_CITY] = 'Population has reached 10,000';
messageText[messages.REACHED_MEGALOPOLIS] = 'Population has reached 500,000';
messageText[messages.REACHED_METROPOLIS] = 'Population has reached 100,000';
messageText[messages.REACHED_TOWN] = 'Population has reached 2,000';

var Text = {
  badMessages: badMessages,
  cityClass: cityClass,
  crimeStrings: crimeStrings,
  densityStrings: densityStrings,
  gameLevel: gameLevel,
  goodMessages: goodMessages,
  landValueStrings: landValueStrings,
  messageText: messageText,
  months: months,
  neutralMessages: neutralMessages,
  problems: problems,
  pollutionStrings: pollutionStrings,
  rateStrings: rateStrings,
  toolMessages: toolMessages,
  zoneTypes: zoneTypes
};



;// ./src/evaluationWindow.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */







var EvaluationWindow = ModalWindow(function() {
  jquery(evaluationFormID).on('submit', evaluationWindow_submit.bind(this));
});


var evaluationFormID = '#evalButtons';
var evaluationOKID = '#evalOK';


EvaluationWindow.prototype.close = function() {
  this._emitEvent(messages.EVAL_WINDOW_CLOSED);
  this._toggleDisplay();
};


var evaluationWindow_submit = function(e) {
  e.preventDefault();
  this.close();
};


EvaluationWindow.prototype._populateWindow = function(evaluation) {
  jquery('#evalYes').text(evaluation.cityYes);
  jquery('#evalNo').text(100 - evaluation.cityYes);
  for (var i = 0; i < 4; i++) {
    var problemNo = evaluation.getProblemNumber(i);
    if (problemNo !== null) {
      var text = Text.problems[problemNo];
      jquery('#evalProb' + (i + 1)).text(text);
      jquery('#evalProb' + (i + 1)).show();
    } else {
      jquery('#evalProb' + (i + 1)).hide();
    }
  }

  jquery('#evalPopulation').text(evaluation.cityPop);
  jquery('#evalMigration').text(evaluation.cityPopDelta);
  jquery('#evalValue').text(evaluation.cityAssessedValue);
  jquery('#evalLevel').text(Text.gameLevel[evaluation.gameLevel]);
  jquery('#evalClass').text(Text.cityClass[evaluation.cityClass]);
  jquery('#evalScore').text(evaluation.cityScore);
  jquery('#evalScoreDelta').text(evaluation.cityScoreDelta);
};


EvaluationWindow.prototype.open = function(evaluation) {
  this._populateWindow(evaluation);
  this._toggleDisplay();
};




;// ./src/tileHistory.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */

function TileHistory() {
  this.clear();
}


var tileHistory_toKey = function(x, y) {
  return [x, y].join(',');
};


TileHistory.prototype.clear = function() {
  this.data = {};
};


TileHistory.prototype.getTile = function(x, y) {
  var key = tileHistory_toKey(x, y);
  return this.data[key];
};


TileHistory.prototype.setTile = function(x, y, value) {
  var key = tileHistory_toKey(x, y);
  this.data[key] = value;
};




;// ./src/animationManager.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */







function AnimationManager(map, animationPeriod, blinkPeriod) {
  animationPeriod = animationPeriod || 50;
  blinkPeriod = blinkPeriod || 500;

  this._map = map;
  this.animationPeriod = animationPeriod;
  this.lastAnimation = new Date(1970, 1, 1);
  this.lastBlink = new Date(1970, 1, 1);
  this.blinkPeriod = blinkPeriod;
  this.shouldBlink = false;

  // When painting we keep track of what frames
  // have been painted at which map coordinates so we can
  // consistently display the correct frame even as the
  // canvas moves
  this._lastPainted = null;
  this._currentPainted = null;

  this._data = [];
  this.initArray();
  this.registerAnimations();
}


AnimationManager.prototype.initArray = function() {
  // Map all tiles to their own value in case we ever
  // look up a tile that is not animated
  for (var i = 0; i < src_tileValues.TILE_COUNT; i++)
    this._data[i] = i;
};


AnimationManager.prototype.inSequence = function(tileValue, lastValue) {
  // It is important that we use the base value as the starting point
  // rather than the last painted value: base values often don't recur
  // in their sequences
  var seen = [tileValue];
  var current = this._data[tileValue];

  while (seen.indexOf(current) === -1) {
    if (current === lastValue)
      return true;

    seen.push(current);
    current = this._data[current];
  }
  return false;
};


// Takes an array of tile values, and overwrites with the correct tile after factoring in animations and
// power blinks. offsetX and offsetY represent the offset into the map the tileArray represents; xBound and
// yBound note how far to iterate (the idea being that GameCanvas recycles its tile value array)
AnimationManager.prototype.getTiles = function(tileValues, offsetX, offsetY, xBound, yBound, isPaused) {
  isPaused = isPaused || false;

  var shouldChangeAnimation = false;
  var d = new Date();

  var shouldBlink = this.shouldBlink;
  if (d - this.lastBlink > this.blinkPeriod) {
    shouldBlink = this.shouldBlink = !this.shouldBlink;
    this.lastBlink = d;
  }

  if (!isPaused) {
    if (d - this.lastAnimation > this.animationPeriod) {
      shouldChangeAnimation = true;
      this.lastAnimation = d;
    }
  }


  var newPainted = this._currentPainted === null ? new TileHistory() : this._currentPainted;

  for (var y = 0; y < yBound; y++) {
    for (var x = 0; x < xBound; x++) {
      var mapX = x + offsetX;
      var mapY = y + offsetY;
      var index = y * xBound + x;

      if (mapX < 0 || mapX >= this._map.width || mapY < 0 || mapY >= this._map.height)
        continue;

      var tile = tileValues[index];
      if (tile === src_tileValues.TILE_INVALID)
        continue;

      if (shouldBlink && (tile & src_tileFlags.ZONEBIT) && !(tile & src_tileFlags.POWERBIT)) {
        tileValues[index] = src_tileValues.LIGHTNINGBOLT;
        continue;
      }

      if (!(tile & src_tileFlags.ANIMBIT)) {
        tileValues[index] = tile & src_tileFlags.BIT_MASK;
        continue;
      }

      var tileValue = tile & src_tileFlags.BIT_MASK;
      var newTile = src_tileValues.TILE_INVALID;
      var last;
      if (this._lastPainted)
        last = this._lastPainted.getTile(x, y);

      if (shouldChangeAnimation) {
        // Have we painted any of this sequence before? If so, paint the next tile
        if (last && this.inSequence(tileValue, last)) {
          // To ensure demolition explosions are animated smoothly, we adjust the map here when we have run to the
          // end of the animation. We would otherwise have to wait on MapScan running and picking up the explosion
          // tile, which may not happen for several frames
          if (last === src_tileValues.LASTTINYEXP) {
            this._map.setTo(mapX, mapY, TileUtils.randomRubble());
            newTile = this._map.getTileValue(mapX, mapY);
          } else {
            newTile = this._data[last];
          }
        } else {
          // Either we haven't painted anything here before, or the last tile painted
          // there belongs to a different tile's animation sequence
          newTile = this._data[tileValue];
        }
      } else {
        // Have we painted any of this sequence before? If so, paint the same tile
        if (last && this.inSequence(tileValue, last))
          newTile = last;
      }

      if (newTile === src_tileValues.TILE_INVALID) {
        tileValues[index] = tileValue;
        continue;
      }

      tileValues[index] = newTile;
      newPainted.setTile(x, y, newTile);
    }
  }

  // Rotate tile histories
  var temp = this._lastPainted;
  this._lastPainted = newPainted;

  if (temp !== null)
    temp.clear();
  this._currentPainted = temp;
};


AnimationManager.prototype.registerSingleAnimation = function(arr) {
  for (var i = 1; i < arr.length; i++)
    this._data[arr[i - 1]] = arr[i];
};


AnimationManager.prototype.registerAnimations = function() {
  this.registerSingleAnimation([56, 57, 58, 59, 60, 61, 62, 63, 56]);
  this.registerSingleAnimation([80, 128, 112, 96, 80]);
  this.registerSingleAnimation([81, 129, 113, 97, 81]);
  this.registerSingleAnimation([82, 130, 114, 98, 82]);
  this.registerSingleAnimation([83, 131, 115, 99, 83]);
  this.registerSingleAnimation([84, 132, 116, 100, 84]);
  this.registerSingleAnimation([85, 133, 117, 101, 85]);
  this.registerSingleAnimation([86, 134, 118, 102, 86]);
  this.registerSingleAnimation([87, 135, 119, 103, 87]);
  this.registerSingleAnimation([88, 136, 120, 104, 88]);
  this.registerSingleAnimation([89, 137, 121, 105, 89]);
  this.registerSingleAnimation([90, 138, 122, 106, 90]);
  this.registerSingleAnimation([91, 139, 123, 107, 91]);
  this.registerSingleAnimation([92, 140, 124, 108, 92]);
  this.registerSingleAnimation([93, 141, 125, 109, 93]);
  this.registerSingleAnimation([94, 142, 126, 110, 94]);
  this.registerSingleAnimation([95, 143, 127, 111, 95]);
  this.registerSingleAnimation([144, 192, 176, 160, 144]);
  this.registerSingleAnimation([145, 193, 177, 161, 145]);
  this.registerSingleAnimation([146, 194, 178, 162, 146]);
  this.registerSingleAnimation([147, 195, 179, 163, 147]);
  this.registerSingleAnimation([148, 196, 180, 164, 148]);
  this.registerSingleAnimation([149, 197, 181, 165, 149]);
  this.registerSingleAnimation([150, 198, 182, 166, 150]);
  this.registerSingleAnimation([151, 199, 183, 167, 151]);
  this.registerSingleAnimation([152, 200, 184, 168, 152]);
  this.registerSingleAnimation([153, 201, 185, 169, 153]);
  this.registerSingleAnimation([154, 202, 186, 170, 154]);
  this.registerSingleAnimation([155, 203, 187, 171, 155]);
  this.registerSingleAnimation([156, 204, 188, 172, 156]);
  this.registerSingleAnimation([157, 205, 189, 173, 157]);
  this.registerSingleAnimation([158, 206, 190, 174, 158]);
  this.registerSingleAnimation([159, 207, 191, 175, 159]);
  this.registerSingleAnimation([621, 852, 853, 854, 855, 856, 857, 858, 859, 852]);
  this.registerSingleAnimation([641, 884, 885, 886, 887, 884]);
  this.registerSingleAnimation([644, 888, 889, 890, 891, 888]);
  this.registerSingleAnimation([649, 892, 893, 894, 895, 892]);
  this.registerSingleAnimation([650, 896, 897, 898, 899, 896]);
  this.registerSingleAnimation([676, 900, 901, 902, 903, 900]);
  this.registerSingleAnimation([677, 904, 905, 906, 907, 904]);
  this.registerSingleAnimation([686, 908, 909, 910, 911, 908]);
  this.registerSingleAnimation([689, 912, 913, 914, 915, 912]);
  this.registerSingleAnimation([747, 916, 917, 918, 919, 916]);
  this.registerSingleAnimation([748, 920, 921, 922, 923, 920]);
  this.registerSingleAnimation([751, 924, 925, 926, 927, 924]);
  this.registerSingleAnimation([752, 928, 929, 930, 931, 928]);
  this.registerSingleAnimation([820, 952, 953, 954, 955, 952]);
  this.registerSingleAnimation([832, 833, 834, 835, 836, 837, 838, 839, 832]);
  this.registerSingleAnimation([840, 841, 842, 843, 840]);
  this.registerSingleAnimation([844, 845, 846, 847, 848, 849, 850, 851, 844]);
  this.registerSingleAnimation([860, 861, 862, 863, 864, 865, 866, 867]);
  this.registerSingleAnimation([932, 933, 934, 935, 936, 937, 938, 939, 932]);
  this.registerSingleAnimation([940, 941, 942, 943, 944, 945, 946, 947, 940]);
};




// EXTERNAL MODULE: ./src/bounds.ts
var bounds = __webpack_require__(363);
;// ./src/gameMap.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */









function GameMap(width, height, defaultValue) {
  if (!(this instanceof GameMap))
    return new GameMap(width, height, defaultValue);

  if (arguments.length > 1 && typeof(width) === 'number' &&
      (width < 1 || height < 1))
    throw new Error('GameMap constructor called with invalid width or height ' + width + ' ' + height);

  // Argument shuffling
  if (arguments.length === 0) {
    width = 120;
    height = 100;
    defaultValue = new src_tile.Tile().getValue();
  } else if (arguments.length === 1) {
    if (typeof(width) === 'number') {
      // Default value
      defaultValue = width;
    } else {
      // Tile
      defaultValue = width.getValue();
    }
    width = 120;
    height = 100;
  } else if (arguments.length === 2) {
    defaultValue = new src_tile.Tile().getValue();
  } else if (arguments.length === 3) {
    if (typeof(defaultValue) === 'object')
      defaultValue = defaultValue.getValue();
  }


  this.width = width;
  this.height = height;
  this.bounds = bounds/* Bounds */.c.fromOrigin(width, height);

  var data = [];
  for (var i = 0, l = width * height; i < l; i++)
    data[i] = new src_tile.Tile(defaultValue);
  this._data = data;

  // Generally set externally
  this.cityCentreX = Math.floor(this.width / 2);
  this.cityCentreY = Math.floor(this.height / 2);
  this.pollutionMaxX = this.cityCentreX;
  this.pollutionMaxY = this.cityCentreY;
}


var gameMap_saveProps = ['cityCentreX', 'cityCentreY', 'pollutionMaxX', 'pollutionMaxY', 'width', 'height'];

GameMap.prototype.save = function(saveData) {
  for (var i = 0, l = gameMap_saveProps.length; i < l; i++)
    saveData[gameMap_saveProps[i]] = this[gameMap_saveProps[i]];

  saveData.map = this._data.map(function(t) {
    return {value: t.getRawValue()};
  });
};


GameMap.prototype.load = function(saveData) {
  for (var i = 0, l = gameMap_saveProps.length; i < l; i++)
    this[gameMap_saveProps[i]] = saveData[gameMap_saveProps[i]];

  var map = saveData.map;
  for (i = 0, l = map.length; i < l; i++)
    this.setTileValue(i % this.width, Math.floor(i / this.width), map[i].value);
};


GameMap.prototype._calculateIndex = function(x, y) {
  return x + y * this.width;
};


GameMap.prototype.isPositionInBounds = function(pos) {
  return this.bounds.contains(pos);
}


GameMap.prototype.testBounds = function(x, y) {
  return this.isPositionInBounds(new position.Position(x, y));
};


GameMap.prototype.getTile = function(x, y, newTile) {
  // Argument-shuffling
  if (typeof(x) === 'object') {
    y = x.y;
    x = x.x;
  }

  var width = this.width;
  var height = this.height;

  if (x < 0 || y < 0 || x >= width || y >= height) {
    console.warn('getTile called with bad bounds', x, y);
    return new src_tile.Tile(src_tileValues.TILE_INVALID);
  }

  var tileIndex = x + y * width;
  var tile = this._data[tileIndex];

  // Return the original tile if we're not given a tile to fill
  if (!newTile)
    return tile;

  newTile.setFrom(tile);
  return tile;
};


GameMap.prototype.getTileValue = function(x, y) {
  if (arguments.length < 1)
    throw new Error('GameMap getTileValue called with too few arguments' + [].toString.apply(arguments));

  // Argument-shuffling
  if (typeof(x) === 'object') {
    y = x.y;
    x = x.x;
  }

  if (!this.testBounds(x, y))
    throw new Error('GameMap getTileValue called with invalid bounds ' + x + ', ' + y);

  var tileIndex = this._calculateIndex(x, y);
  return this._data[tileIndex].getValue();
};


GameMap.prototype.getTileFlags = function(x, y) {
  if (arguments.length < 1)
    throw new Error('GameMap getTileFlags called with too few arguments' + [].toString.apply(arguments));

  // Argument-shuffling
  if (typeof(x) === 'object') {
    y = x.y;
    x = x.x;
  }

  if (!this.testBounds(x, y))
    throw new Error('GameMap getTileFlags called with invalid bounds ' + x + ', ' + y);

  var tileIndex = this._calculateIndex(x, y);
  return this._data[tileIndex].getFlags();
};


GameMap.prototype.getTiles = function(x, y, w, h) {
  if (arguments.length < 3)
    throw new Error('GameMap getTiles called with too few arguments' + [].toString.apply(arguments));

  // Argument-shuffling
  if (arguments.length === 3) {
    h = w;
    w = y;
    y = x.y;
    x = x.x;
  }

  if (!this.testBounds(x, y))
    throw new Error('GameMap getTiles called with invalid bounds ' + x + ', ' + y);

  var res = [];
  for (var a = y, ylim = y + h; a < ylim; a++) {
    res[a - y] = [];
    for (var b = x, xlim = x + w; b < xlim; b++) {
      var tileIndex = this._calculateIndex(b, a);
      res[a-y].push(this._data[tileIndex]);
    }
  }
  return res;
};


GameMap.prototype.getTileValuesForPainting = function(x, y, w, h, result) {
  result = result || [];

  if (arguments.length < 3)
    throw new Error('GameMap getTileValuesForPainting called with too few arguments' + [].toString.apply(arguments));

  // Argument-shuffling
  if (arguments.length === 3) {
    h = w;
    w = y;
    y = x.y;
    x = x.x;
  }

  var width = this.width;
  var height = this.height;

  // Result is stored in row-major order
  for (var a = y, ylim = y + h; a < ylim; a++) {
    for (var b = x, xlim = x + w; b < xlim; b++) {
      if (a < 0 || b < 0 || a >= height || b >= width) {
        result[(a - y) * w + (b - x)] = src_tileValues.TILE_INVALID;
        continue;
      }

      var tileIndex =  b + a * width;
      result[(a - y) * w + (b - x)] = this._data[tileIndex].getRawValue();
    }
  }

  return result;
};


GameMap.prototype.getTileFromMapOrDefault = function(pos, dir, defaultTile) {
  switch (dir) {
    case direction.NORTH:
      if (pos.y > 0)
        return this.getTileValue(pos.x, pos.y - 1);
      return defaultTile;

    case direction.EAST:
      if (pos.x < this.width - 1)
        return this.getTileValue(pos.x + 1, pos.y);

      return defaultTile;

    case direction.SOUTH:
      if (pos.y < this.height - 1)
        return this.getTileValue(pos.x, pos.y + 1);

      return defaultTile;

    case direction.WEST:
      if (pos.x > 0)
        return this.getTileValue(pos.x - 1, pos.y);

      return defaultTile;

    default:
        return defaultTile;
  }
};


GameMap.prototype.setTile = function(x, y, value, flags) {
  if (arguments.length < 3)
    throw new Error('GameMap setTile called with too few arguments' + [].toString.apply(arguments));

  // Argument-shuffling
  if (arguments.length === 3) {
    flags = value;
    value = y;
    y = x.y;
    x = x.x;
  }

  if (!this.testBounds(x, y))
    throw new Error('GameMap setTile called with invalid bounds ' + x + ', ' + y);

  var tileIndex = this._calculateIndex(x, y);
  this._data[tileIndex].set(value, flags);
};


GameMap.prototype.setTo = function(x, y, tile) {
  if (arguments.length < 2)
    throw new Error('GameMap setTo called with too few arguments' + [].toString.apply(arguments));

  // Argument-shuffling
  if (tile === undefined) {
    tile = y;
    y = x.y;
    x = x.x;
  }

  if (!this.testBounds(x, y))
    throw new Error('GameMap setTo called with invalid bounds ' + x + ', ' + y);

  var tileIndex = this._calculateIndex(x, y);
  this._data[tileIndex] = tile;
};


GameMap.prototype.setTileValue = function(x, y, value) {
  if (arguments.length < 2)
    throw new Error('GameMap setTileValue called with too few arguments' + [].toString.apply(arguments));

  // Argument-shuffling
  if (arguments.length === 2) {
    value = y;
    y = x.y;
    x = x.x;
  }

  if (!this.testBounds(x, y))
    throw new Error('GameMap setTileValue called with invalid bounds ' + x + ', ' + y);

  var tileIndex = this._calculateIndex(x, y);
  this._data[tileIndex].setValue(value);
};


GameMap.prototype.setTileFlags = function(x, y, flags) {
  if (arguments.length < 2)
    throw new Error('GameMap setTileFlags called with too few arguments' + [].toString.apply(arguments));

  // Argument-shuffling
  if (arguments.length === 2) {
    flags = y;
    y = x.y;
    x = x.x;
  }

  if (!this.testBounds(x, y))
    throw new Error('GameMap setTileFlags called with invalid bounds ' + x + ', ' + y);

  var tileIndex = this._calculateIndex(x, y);
  this._data[tileIndex].setFlags(flags);
};


GameMap.prototype.addTileFlags = function(x, y, flags) {
  if (arguments.length < 2)
    throw new Error('GameMap addTileFlags called with too few arguments' + [].toString.apply(arguments));

  // Argument-shuffling
  if (arguments.length === 2) {
    flags = y;
    y = x.y;
    x = x.x;
  }

  if (!this.testBounds(x, y))
    throw new Error('GameMap addTileFlags called with invalid bounds ' + x + ', ' + y);

  var tileIndex = this._calculateIndex(x, y);
  this._data[tileIndex].addFlags(flags);
};


GameMap.prototype.removeTileFlags = function(x, y, flags) {
  if (arguments.length < 2)
    throw new Error('GameMap removeTileFlags called with too few arguments' + [].toString.apply(arguments));

  // Argument-shuffling
  if (arguments.length === 2) {
    flags = y;
    y = x.y;
    x = x.x;
  }

  if (!this.testBounds(x, y))
    throw new Error('GameMap removeTileFlags called with invalid bounds ' + x + ', ' + y);

  var tileIndex = this._calculateIndex(x, y);
  this._data[tileIndex].removeFlags(flags);
};


GameMap.prototype.putZone = function(centreX, centreY, centreTile, size) {
  var x, y;

  if (!this.testBounds(centreX, centreY) || !this.testBounds(centreX - 1 + size - 1, centreY - 1 + size - 1))
    throw new Error('GameMap putZone called with invalid bounds ' + x + ', ' + y);

  var tile = centreTile - 1 - size;
  var startX = centreX - 1;
  var startY = centreY - 1;

  for (y = startY; y < startY + size; y++) {
    for (x = startX; x < startX + size; x++) {
      if (x === centreX && y === centreY)
        this.setTo(x, y, new src_tile.Tile(tile, src_tileFlags.BNCNBIT | src_tileFlags.ZONEBIT));
      else
        this.setTo(x, y, new src_tile.Tile(tile, src_tileFlags.BNCNBIT));
      tile += 1;
    }
  }
};




;// ./src/mouseBox.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */

var MouseBox = {
  draw: function(c, pos, width, height, options) {
    var lineWidth = options.lineWidth || 3.0;
    var strokeStyle = options.colour || 'yellow';
    var shouldOutline = (('outline' in options) && options.outline === true) || false;

    var startModifier = -1;
    var endModifier = 1;
    if (!shouldOutline) {
      startModifier = 1;
      endModifier = -1;
    }

    var startX = pos.x + startModifier * lineWidth / 2;
    width = width + endModifier * lineWidth;
    var startY = pos.y + startModifier * lineWidth / 2;
    height = height + endModifier * lineWidth;

    var ctx = c.getContext('2d');
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.strokeRect(startX, startY, width, height);
  }
};




;// ./src/tileSet.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */



// Tiles must be 16px square
var TILE_SIZE = 16;
var TILES_PER_ROW = Math.sqrt(src_tileValues.TILE_COUNT);
var ACCEPTABLE_DIMENSION = TILES_PER_ROW * TILE_SIZE;


function TileSet(image, callback, errorCallback) {
  if (!(this instanceof TileSet))
    return new TileSet(image, callback, errorCallback);

  if (callback === undefined || errorCallback === undefined) {
    if (callback === undefined && errorCallback === undefined)
      throw new Error('Tileset constructor called with no callback or errorCallback');
    else
      throw new Error('Tileset constructor called with no ' + (callback === undefined ? 'callback' : 'errorCallback'));
  }

  this.isValid = false;

  if (!(image instanceof Image)) {
    // Spin the event loop
    window.setTimeout(errorCallback, 0);
    return;
  }

  this._verifyImage(image, callback, errorCallback);
}


TileSet.prototype._verifyImage = function(image, callback, errorCallback) {
  var width = image.width;
  var height = image.height;

  // We expect tilesets to be square, and of the required width/height
  if (width !== height || width !== ACCEPTABLE_DIMENSION) {
    // Spin the event loop
    window.setTimeout(errorCallback, 0);
    return;
  }

  var tileWidth = this.tileWidth = TILE_SIZE;

  // We paint the image onto a canvas so we can split it up
  var c = document.createElement('canvas');
  c.width = tileWidth;
  c.height = tileWidth;
  var cx = c.getContext('2d');

  // Count how many tiles we have created
  var tileCount = src_tileValues.TILE_COUNT;
  var notifications = 0;
  var self = this;

  // Callback triggered by an image load. Checks to see if we are done creating images,
  // and if so notifies the caller.
  var imageLoad = function() {
    notifications++;

    if (notifications === tileCount) {
      self.isValid = true;
      // Spin the event loop
      window.setTimeout(callback, 0);
      return;
    }
  };

  // Break up the source image into tiles by painting each tile onto a canvas, computing the dataURI
  // of the canvas, and using that to create a new image, which we install on ourselves as a new property
  for (var i = 0; i < tileCount; i++) {
    cx.clearRect(0, 0, tileWidth, tileWidth);

    var sourceX = i % TILES_PER_ROW * tileWidth;
    var sourceY = Math.floor(i / TILES_PER_ROW) * tileWidth;
    cx.drawImage(image, sourceX, sourceY, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth);

    this[i] = new Image();
    this[i].onload = imageLoad;
    this[i].src = c.toDataURL();
  }
};




;// ./src/gameCanvas.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */











function GameCanvas(id, parentNode) {
  if (!(this instanceof GameCanvas))
    return new GameCanvas(id, parentNode, width, height);

  if (arguments.length < 1)
    throw new Error('Attempt to construct a GameCanvas with no parameters');

  // Argument shuffling
  if (parentNode === undefined) {
    // No ID supplied
    parentNode = id;
    id = GameCanvas.DEFAULT_ID;
  }

  if (typeof(parentNode) === 'string') {
    var orig = parentNode;
    parentNode = jquery(MiscUtils.normaliseDOMid(parentNode));
    parentNode = parentNode.length === 0 ? null : parentNode[0];
    if (parentNode === null)
      throw new Error('Node ' + orig + ' not found');
  }

  this._canvas = document.createElement('canvas');
  this._canvas.id = id;

  // The canvas is assumed to fill its container on-screen
  var rect = parentNode.getBoundingClientRect();
  this._canvas.width = rect.width;
  this._canvas.height = rect.height;
  this._canvas.style.margin = '0';
  this._canvas.style.padding = '0';

  this._pendingTileSet = null;

  // Remove any existing element with the same id
  var current = document.getElementById(id);
  if (current !== null) {
    if  (current.parentNode === parentNode)
      parentNode.replaceChild(this._canvas, current);
    else
      throw new Error('ID ' + id + ' already exists in document!');
  } else
    parentNode.appendChild(this._canvas);

  this.ready = false;
}


GameCanvas.prototype.init = function(map, tileSet, spriteSheet, animationManager) {
  animationManager = animationManager || new AnimationManager(map);

  if (arguments.length < 3)
    throw new Error('GameCanvas constructor called with too few arguments ' + [].toString.apply(arguments));

  if (!tileSet.isValid)
    throw new Error('TileSet not ready!');

  this._spriteSheet = spriteSheet;
  this._tileSet = tileSet;
  var w = this._tileSet.tileWidth;
  this._map = map;
  this.animationManager = new AnimationManager(map);

  if (this._canvas.width < w || this._canvas.height < w)
    throw new Error('Canvas too small!');

  // Whether to allow off-map scrolling
  this._allowScrolling = true;

  // An array indexed by tile offset containing the tileValue last painted there
  this._lastPaintedTiles = null;
  this._currentPaintedTiles = []; // for future use

  // Last time we painted, the canvas was this many tiles wide and tall
  this._lastPaintedWidth = -1;
  this._lastPaintedHeight = -1;

  // Last time we painted, the canvas was this wide and tall in pixels (determines whether we
  // can safely call putImageData)
  this._lastCanvasWidth = -1;
  this._lastCanvasHeight = -1;

  // After painting tiles, we store the image data here before painting sprites and mousebox
  this._lastCanvasData = null;

  this._calculateDimensions();

  // Have the dimensions changed since the last paint?
  this._pendingDimensionChange = false;
  var onResize = function(e) {
    this._pendingDimensionChange = true;
  }.bind(this);

  // Recompute canvas dimensions on resize
  window.addEventListener('resize', onResize, false);

  // Order is important here. ready must be set before the call to centreOn below
  this.ready = true;
  this.centreOn(Math.floor(this._map.width / 2), Math.floor(this._map.height / 2));

  this.paint(null, null);
};


GameCanvas.prototype._calculateDimensions = function(force) {
  force = force || false;

  // The canvas is assumed to fill its container on-screen
  var canvasWidth = this.canvasWidth = this._canvas.parentNode.clientWidth;
  var canvasHeight = this.canvasHeight = this._canvas.parentNode.clientHeight;

  if (canvasHeight === this._lastCanvasHeight && canvasWidth === this._lastCanvasWidth && !force)
    return;

  this._canvas.width = canvasWidth;
  this._canvas.height = canvasHeight;

  var w = this._tileSet.tileWidth;

  // How many tiles fit?
  this._wholeTilesInViewX = Math.floor(canvasWidth / w);
  this._wholeTilesInViewY = Math.floor(canvasHeight / w);
  this._totalTilesInViewX = Math.ceil(canvasWidth / w);
  this._totalTilesInViewY = Math.ceil(canvasHeight / w);

  if (this._allowScrolling) {
    // The min/max properties denote how far we will let the canvas' origin move: the map
    // should be visible in at least half the canvas
    this.minX = 0 - Math.ceil(Math.floor(canvasWidth/w) / 2);
    this.maxX = (this._map.width - 1) - Math.ceil(Math.floor(canvasWidth/w) / 2);
    this.minY = 0 - Math.ceil(Math.floor(canvasHeight/w) / 2);
    this.maxY = (this._map.height - 1) - Math.ceil(Math.floor(canvasHeight/w) / 2);
    this._totalTilesInViewY = Math.ceil(canvasHeight / w);
  } else {
    this.minX = 0;
    this.minY = 0;
    this.maxX = this._map.width - this._totalTilesInViewX;
    this.maxY = this._map.height - this._totalTilesInViewY;
  }

  this._pendingDimensionChange = true;
};


// NOTE: Canvas must be visible when this is called
GameCanvas.prototype.disallowOffMap = function() {
  this._allowScrolling = false;
  this._lastPaintedTiles = null;
  this._calculateDimensions(true);
};


GameCanvas.prototype.moveNorth = function() {
  if (!this.ready)
    throw new Error('Not ready!');

  if (this._originY > this.minY)
    this._originY--;
};


GameCanvas.prototype.moveEast = function() {
  if (!this.ready)
    throw new Error('Not ready!');

  if (this._originX < this.maxX)
    this._originX++;
};


GameCanvas.prototype.moveSouth = function() {
  if (!this.ready)
    throw new Error('Not ready!');

  if (this._originY < this.maxY)
    this._originY++;
};


GameCanvas.prototype.moveWest = function() {
  if (!this.ready)
    throw new Error('Not ready!');

  if (this._originX > this.minX)
    this._originX--;
};


GameCanvas.prototype.moveTo = function(x, y) {
  if (arguments.length < 1)
    throw new Error('GameCanvas moveTo called with no arguments');

  if (!this.ready)
    throw new Error('Not ready!');

  if (x < this.minX || x > this.maxX ||
      y < this.minY || y > this.maxY)
    throw new Error('Coordinates out of bounds');

  this._originX = x;
  this._originY = y;
};


GameCanvas.prototype.centreOn = function(x, y) {
  if (arguments.length < 1)
    throw new Error('GameCanvas centreOn called with no arguments');

  if (!this.ready)
    throw new Error('Not ready!');

  if (y === undefined) {
    y = x.y;
    x = x.x;
  }

  // XXX Need to fix so that centres on best point if bounds fall outside
  // XXX min/max
  var originX = Math.floor(x) - Math.ceil(this._wholeTilesInViewX / 2);
  var originY = Math.floor(y) - Math.ceil(this._wholeTilesInViewY / 2);

  if (originX > this.maxX)
    originX = this.maxX;
  if (originX < this.minX)
    originX = this.minX;
  if (originY > this.maxY)
    originY = this.maxY;
  if (originY < this.minY)
    originY = this.minY;

  this._originX = originX;
  this._originY = originY;
};


GameCanvas.prototype.getTileOrigin = function() {
  var e = new Error('Not ready!');

  if (!this.ready)
    throw e;

  return {x: this._originX, y: this._originY};
};


GameCanvas.prototype.getMaxTile = function() {
  var e = new Error('Not ready!');

  if (!this.ready)
    throw e;

  return {x: this._originX + this._totalTilesInViewX - 1, y: this._originY + this._totalTilesInViewY - 1};
};


GameCanvas.prototype.canvasCoordinateToTileOffset = function(x, y) {
  if (arguments.length < 2)
    throw new Error('GameCanvas canvasCoordinateToTileOffset called with too few arguments ' + [].toString.apply(arguments));

  if (!this.ready)
    throw new Error('Not ready!');

  return {x: Math.floor(x / this._tileSet.tileWidth),
          y: Math.floor(y / this._tileSet.tileWidth)};
};


GameCanvas.prototype.canvasCoordinateToTileCoordinate = function(x, y) {
  if (arguments.length < 2)
    throw new Error('GameCanvas canvasCoordinateToTileCoordinate called with too few arguments ' + [].toString.apply(arguments));

  if (!this.ready)
    throw new Error('Not ready!');

  if (x >= this.canvasWidth || y >= this.canvasHeight)
    return null;

  return {x: this._originX + Math.floor(x/this._tileSet.tileWidth),
          y: this._originY + Math.floor(y/this._tileSet.tileWidth)};
};


GameCanvas.prototype.canvasCoordinateToPosition = function(x, y) {
  if (arguments.length < 2)
    throw new Error('GameCanvas canvasCoordinateToPosition called with too few arguments ' + [].toString.apply(arguments));

  if (!this.ready)
    throw new Error('Not ready!');

  if (x >= this.canvasWidth || y >= this.canvasHeight)
    return null;

  x = this._originX + Math.floor(x / this._tileSet.tileWidth);
  y = this._originY + Math.floor(y / this._tileSet.tileWidth);


  if (x < 0 || x >= this._map.width || y < 0 || y >= this._map.height)
    return null;

  return new position.Position(x, y);
};



GameCanvas.prototype.positionToCanvasCoordinate = function(p) {
  if (arguments.length < 1)
    throw new Error('GameCanvas positionToCanvasCoordinate called with too few arguments ' + [].toString.apply(arguments));

  return this.tileToCanvasCoordinate(p);
};



GameCanvas.prototype.tileToCanvasCoordinate = function(x, y) {
  if (arguments.length < 1)
    throw new Error('GameCanvas tileToCanvasCoordinate  called with too few arguments ' + [].toString.apply(arguments));

  if (!this.ready)
    throw new Error('Not ready!');

  if (y === undefined) {
    y = x.y;
    x = x.x;
  }

  if (x === undefined || y === undefined || x < this.minX || y < this.minY ||
      x > (this.maxX + this._totalTilesInViewX - 1) ||
      y > (this.maxY + this._totalTilesInViewY - 1))
    throw e;

  if (x < this._originX || x >= this._originX + this._totalTilesInViewX ||
      y < this._originY || y >= this._originY + this._totalTilesInViewY)
    return null;

  return {x: (x - this._originX) * this._tileSet.tileWidth,
          y: (y - this._originY) * this._tileSet.tileWidth};
};



GameCanvas.prototype.changeTileSet = function(tileSet) {
  if (!this.ready)
    throw new Error('Not ready!');

  if (!tileSet.isValid)
    throw new Error('new tileset not loaded');

  this._pendingTileSet = tileSet;
};



GameCanvas.prototype._screenshot = function(onlyVisible) {
  if (onlyVisible)
    return this._canvas.toDataURL();

  var tempCanvas = document.createElement('canvas');
  tempCanvas.width = this._map.width * this._tileSet.tileWidth;
  tempCanvas.height = this._map.height * this._tileSet.tileWidth;
  var ctx = tempCanvas.getContext('2d');

  for (var x = 0; x < this._map.width; x++) {
    for (var y = 0; y < this._map.height; y++) {
      this._paintOne(ctx, this._map.getTileValue(x, y), x, y);
    }
  }
  return tempCanvas.toDataURL();
};


GameCanvas.prototype.screenshotMap = function() {
  return this._screenshot(false);
};


GameCanvas.prototype.screenshotVisible = function() {
  return this._screenshot(true);
};


GameCanvas.prototype.shoogle = function() {
  // TODO Earthquakes
};


GameCanvas.prototype._processSprites = function(ctx, spriteList) {
  var spriteDamage = [];
  var tileWidth = this._tileSet.tileWidth;

  for (var i = 0, l = spriteList.length; i < l; i++) {
    var sprite = spriteList[i];
    try {
      ctx.drawImage(this._spriteSheet,
                    (sprite.frame - 1) * 48,
                    (sprite.type - 1) * 48,
                    sprite.width,
                    sprite.width,
                    sprite.x + sprite.xOffset - this._originX * 16,
                    sprite.y + sprite.yOffset - this._originY * 16,
                    sprite.width,
                    sprite.width);
    } catch (e) {
      throw new Error('Failed to draw sprite ' + sprite.type + ' frame ' + sprite.frame + ' at ' + sprite.x +  ', ' + sprite.y);
    }

    // sprite values are in pixels
    spriteDamage.push({x: Math.floor((sprite.x + sprite.xOffset - this._originX * 16) / tileWidth),
                       xBound: Math.ceil((sprite.x + sprite.xOffset + sprite.width - this._originX * 16) / tileWidth),
                       y: Math.floor((sprite.y + sprite.yOffset - this._originY * 16) / tileWidth),
                       yBound: Math.ceil((sprite.y + sprite.yOffset + sprite.height - this._originY * 16) / tileWidth)});
  }

  return spriteDamage;
};


// Draws a mouse outline around the selected tiles. The mouse object is assumed to contain x and y properties which
// express the coordinate of the top-left of the box in terms of the number of tiles from the top left. It should
// also contain a width and height that are again expressed in terms of the number of tiles. The colour property
// naturally defines the colour of the painted box.
GameCanvas.prototype._processMouse = (function() {
  var damage = {x: 0, xBound: 0, y: 0, yBound: 0};

  return function(mouse) {
    if (mouse.width === 0 || mouse.height === 0)
      return;

    // For outlines bigger than 2x2 (in either dimension) assume the mouse is offset by
    // one tile
    var mouseX = mouse.x;
    var mouseY = mouse.y;
    var mouseWidth = mouse.width;
    var mouseHeight = mouse.height;
    var options = {colour: mouse.colour, outline: true};

    if (mouseWidth > 2)
      mouseX -= 1;
    if (mouseHeight > 2)
      mouseY -= 1;

    var offMap = (this._originX + mouseX < 0 && this._originX + mouseX + mouseWidth <= 0) ||
                 (this._originY + mouseY < 0 && this._originY + mouseY + mouseHeight <= 0) ||
                 this._originX + mouseX >= this._map.width || this._originY + mouseY >= this._map.height;

    if (offMap) {
      damage.x = damage.xBound = mouseX;
      damage.y = damage.yBound = mouseY;
      return damage;
    }

    var pos = {x: mouseX * this._tileSet.tileWidth, y: mouseY * this._tileSet.tileWidth};
    var width = mouseWidth * this._tileSet.tileWidth;
    var height = mouseHeight * this._tileSet.tileWidth;
    MouseBox.draw(this._canvas, pos, width, height, options);

    // Return an object representing tiles that were damaged that will need redrawn
    // Note that we must take an extra tile either side to account for the outline
    damage.x = mouseX - 1;
    damage.xBound = mouseX + mouseWidth + 2;
    damage.y = mouseY - 1;
    damage.yBound = mouseY + mouseWidth + 2;
    return damage;
  };
})();


GameCanvas.prototype._paintVoid = function(ctx, x, y) {
  var w = this._tileSet.tileWidth;
  ctx.fillStyle = 'black';
  ctx.fillRect(x * w, y * w, w, w);
};


GameCanvas.prototype._paintOne = function(ctx, tileVal, x, y) {
  if (tileVal === src_tileValues.TILE_INVALID) {
    this._paintVoid(ctx, x, y);
    return;
  }

  var src = this._tileSet[tileVal];
  try {
    ctx.drawImage(src, x * this._tileSet.tileWidth, y * this._tileSet.tileWidth);
  } catch (e) {
    var mapX = this._originX + x;
    var mapY = this._originY + y;
    throw new Error('Failed to draw tile ' + tileVal + ' at ' + x + ', ' + y + ' (map ' + mapX + ', ' + mapY + ' tile ' + (this._map.testBounds(mapX, mapY) ? this._map.getTileValue(mapX, mapY) : '?? (Out of bounds)') + ')');
  }
};


GameCanvas.prototype._paintTiles = function(ctx, paintData) {
  var x, y, row, index;
  var lastPaintedTiles = this._lastPaintedTiles;

  var width = this._totalTilesInViewX;
  var height = this._totalTilesInViewY;

  if (lastPaintedTiles !== null) {
    // We have painted the canvas before. There are 3 possibilities:
    //  - The canvas is exactly the same size as last time we painted
    //  - The canvas has grown
    //  - The canvas has shrunk
    //
    // In any case, we want to find the minimal area that was onscreen last paint
    // and this paint, and iterate over those tiles, repainting where necessary
    var xBound = Math.min(this._lastPaintedWidth, width);
    var yBound = Math.min(this._lastPaintedHeight, height);

    // Loop over the common area that we painted last time. Compare the current value against what was there last time
    for (y = 0; y < yBound; y++) {
      for (x = 0; x < xBound; x++) {
        index  = y * xBound + x;
        if (lastPaintedTiles[index] === paintData[index])
          continue;

        // Tile is different: repaint
        this._paintOne(ctx, paintData[index], x, y);
      }
    }

    // Do we have more tiles than before? Paint the extra width and/or the extra height
    if (width > this._lastPaintedWidth) {
      for (y = 0; y < height; y++) {
        for (x = this._lastPaintedWidth; x < width; x++) {
          index  = y * width + x;
          this._paintOne(ctx, paintData[index], x, y);
        }
      }
    }

    if (height > this._lastPaintedHeight) {
      for (y = this._lastPaintedHeight; y < height; y++) {
        for (x = 0; x < width; x++) {
          index  = y * width + x;
          this._paintOne(ctx, paintData[index], x, y);
        }
      }
    }
  } else {
    // Full paint
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        index = y * width + x;
        this._paintOne(ctx, paintData[index], x, y);
      }
    }
  }

  // Stash data
  this._lastPaintedWidth = width;
  this._lastPaintedHeight = height;

  // Rotate tile data
  var temp = this._lastPaintedTiles;
  this._lastPaintedTiles = paintData;
  this._currentPaintedTiles = temp;
};


GameCanvas.prototype.paint = function(mouse, sprites, isPaused) {
  var i, l, x, y, row, damaged, xBound, yBound, index;

  if (!this.ready)
    throw new Error('Not ready!');

  var ctx = this._canvas.getContext('2d');
  var lastPaintedTiles = this._lastPaintedTiles;

  // Recompute our dimensions if there has been a resize since last paint
  if (this._pendingDimensionChange || this._pendingTileSet) {
    this._calculateDimensions();
    this._pendingDimensionChange = false;

    // Change tileSet if necessary
    if (this._pendingTileSet !== null)
      this._tileSet = this._pendingTileSet;

    // If the dimensions or tileset has changed, set each entry in lastPaintedTiles to a bogus value to force a
    // repaint. Note: we use -2 as our bogus value; -1 would paint the black void
    if (this._pendingTileSet || this.canvasWidth !== this._lastCanvasWidth || this.canvasHeight !== this._lastCanvasHeight) {
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      for (y = 0, l = (lastPaintedTiles !== null ? lastPaintedTiles.length : 0); y < l; y++)
        lastPaintedTiles[y] = -2;
    }

    this._pendingTileSet = null;
  }

  var paintWidth = this._totalTilesInViewX;
  var paintHeight = this._totalTilesInViewY;

  // Fill an array with the values we need to paint
  var tileValues = this._map.getTileValuesForPainting(this._originX, this._originY, paintWidth, paintHeight, this._currentPaintedTiles);

  // Adjust for animations
  this.animationManager.getTiles(tileValues, this._originX, this._originY, paintWidth, paintHeight, isPaused);

  this._paintTiles(ctx, tileValues);
  // The _paintTiles call updates this._lastPaintedTiles. Update our cached copy
  lastPaintedTiles = this._lastPaintedTiles;

  // Stash various values for next paint
  this._lastCanvasWidth = this.canvasWidth;
  this._lastCanvasHeight = this.canvasHeight;

  if (!mouse && !sprites) {
    return;
  }

  if (mouse) {
    damaged = this._processMouse(mouse);

    for (y = Math.max(0, damaged.y), yBound = Math.min(paintHeight, damaged.yBound); y < yBound; y++) {
      for (x = Math.max(0, damaged.x), xBound = Math.min(paintWidth, damaged.xBound); x < xBound; x++) {
        index = [y * paintWidth + x];
        // Note: we can't use TILE_INVALID (-1) as that in some sense is a valid tile for the void!
        lastPaintedTiles[index] = -2;
      }
    }
  }

  if (sprites) {
    damaged = this._processSprites(ctx, sprites);
    for (i = 0, l = damaged.length; i < l; i++) {
      var damagedArea = damaged[i];
      for (y = Math.max(0, damagedArea.y), yBound = Math.min(damagedArea.yBound, paintHeight); y < yBound; y++) {
        for (x = Math.max(0, damagedArea.x), xBound = Math.min(damagedArea.xBound, paintWidth); x < xBound; x++) {
          index = [y * paintWidth + x];
          this._lastPaintedTiles[index] = -2;
        }
      }
    }
  }
};


GameCanvas.DEFAULT_ID = 'MicropolisCanvas';




;// ./src/infoBar.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */







// TODO L20N

var InfoBar = function(classification, population, score, funds, date, name) {
  var classificationSelector = MiscUtils.normaliseDOMid(classification);
  var populationSelector = MiscUtils.normaliseDOMid(population);
  var scoreSelector = MiscUtils.normaliseDOMid(score);
  var fundsSelector = MiscUtils.normaliseDOMid(funds);
  var dateSelector = MiscUtils.normaliseDOMid(date);
  var nameSelector = MiscUtils.normaliseDOMid(name);

  return function(dataSource, initialValues) {
    jquery(classificationSelector).text(initialValues.classification);
    jquery(populationSelector).text(initialValues.population);
    jquery(scoreSelector).text(initialValues.score);
    jquery(fundsSelector).text(initialValues.funds);
    jquery(dateSelector).text([Text.months[initialValues.date.month], initialValues.date.year].join(' '));
    jquery(nameSelector).text(initialValues.name);

    // Add the various listeners
    dataSource.addEventListener(messages.CLASSIFICATION_UPDATED, function(classification) {
      jquery(classificationSelector).text(classification);
    });

    dataSource.addEventListener(messages.POPULATION_UPDATED, function(population) {
      jquery(populationSelector).text(population);
    });

    dataSource.addEventListener(messages.SCORE_UPDATED, function(score) {
      jquery(scoreSelector).text(score);
    });

    dataSource.addEventListener(messages.FUNDS_CHANGED, function(funds) {
      jquery(fundsSelector).text(funds);
    });

    dataSource.addEventListener(messages.DATE_UPDATED, function(date) {
      jquery(dateSelector).text([Text.months[date.month], date.year].join(' '));
    });
  };
};




;// ./src/connector.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */





var RoadTable = [
  src_tileValues.ROADS, src_tileValues.ROADS2, src_tileValues.ROADS, src_tileValues.ROADS3,
  src_tileValues.ROADS2, src_tileValues.ROADS2, src_tileValues.ROADS4, src_tileValues.ROADS8,
  src_tileValues.ROADS, src_tileValues.ROADS6, src_tileValues.ROADS, src_tileValues.ROADS7,
  src_tileValues.ROADS5, src_tileValues.ROADS10, src_tileValues.ROADS9, src_tileValues.INTERSECTION
];

var RailTable = [
  src_tileValues.LHRAIL, src_tileValues.LVRAIL, src_tileValues.LHRAIL, src_tileValues.LVRAIL2,
  src_tileValues.LVRAIL, src_tileValues.LVRAIL, src_tileValues.LVRAIL3, src_tileValues.LVRAIL7,
  src_tileValues.LHRAIL, src_tileValues.LVRAIL5, src_tileValues.LHRAIL, src_tileValues.LVRAIL6,
  src_tileValues.LVRAIL4, src_tileValues.LVRAIL9, src_tileValues.LVRAIL8, src_tileValues.LVRAIL10
];

var WireTable = [
  src_tileValues.LHPOWER, src_tileValues.LVPOWER, src_tileValues.LHPOWER, src_tileValues.LVPOWER2,
  src_tileValues.LVPOWER, src_tileValues.LVPOWER, src_tileValues.LVPOWER3, src_tileValues.LVPOWER7,
  src_tileValues.LHPOWER, src_tileValues.LVPOWER5, src_tileValues.LHPOWER, src_tileValues.LVPOWER6,
  src_tileValues.LVPOWER4, src_tileValues.LVPOWER9, src_tileValues.LVPOWER8, src_tileValues.LVPOWER10
];


var fixSingle = function(x, y) {
  var adjTile = 0;
  var tile = this._worldEffects.getTile(x, y);

  tile = TileUtils.normalizeRoad(tile);

  if (tile >= src_tileValues.ROADS && tile <= src_tileValues.INTERSECTION) {
    if (y > 0) {
      tile = this._worldEffects.getTileValue(x, y - 1);
      tile = TileUtils.normalizeRoad(tile);

      if ((tile === src_tileValues.HRAILROAD || (tile >= src_tileValues.ROADBASE && tile <= src_tileValues.VROADPOWER)) &&
           tile !== src_tileValues.HROADPOWER && tile !== src_tileValues.VRAILROAD &&
           tile !== src_tileValues.ROADBASE)
        adjTile |= 1;
    }

    if (x < this._map.width - 1) {
      tile = this._worldEffects.getTileValue(x + 1, y);
      tile = TileUtils.normalizeRoad(tile);

      if ((tile === src_tileValues.VRAILROAD || (tile >= src_tileValues.ROADBASE && tile <= src_tileValues.VROADPOWER)) &&
          tile !== src_tileValues.VROADPOWER && tile !== src_tileValues.HRAILROAD &&
          tile !== src_tileValues.VBRIDGE)
        adjTile |= 2;
    }

    if (y < this._map.height - 1) {
      tile = this._worldEffects.getTileValue(x, y + 1);
      tile = TileUtils.normalizeRoad(tile);

      if ((tile === src_tileValues.HRAILROAD || (tile >= src_tileValues.ROADBASE && tile <= src_tileValues.VROADPOWER)) &&
          tile !== src_tileValues.HROADPOWER && tile !== src_tileValues.VRAILROAD &&
          tile !== src_tileValues.ROADBASE)
        adjTile |= 4;
    }

    if (x > 0) {
      tile = this._worldEffects.getTileValue(x - 1, y);
      tile = TileUtils.normalizeRoad(tile);

      if ((tile === src_tileValues.VRAILROAD || (tile >= src_tileValues.ROADBASE && tile <= src_tileValues.VROADPOWER)) &&
          tile !== src_tileValues.VROADPOWER && tile !== src_tileValues.HRAILROAD &&
          tile !== src_tileValues.VBRIDGE)
        adjTile |= 8;
    }

    this._worldEffects.setTile(x, y, RoadTable[adjTile], src_tileFlags.BULLBIT | src_tileFlags.BURNBIT);
    return;
  }

  if (tile >= src_tileValues.LHRAIL && tile <= src_tileValues.LVRAIL10) {
      if (y > 0) {
        tile = this._worldEffects.getTileValue(x, y - 1);
        tile = TileUtils.normalizeRoad(tile);
        if (tile >= src_tileValues.RAILHPOWERV && tile <= src_tileValues.VRAILROAD &&
            tile !== src_tileValues.RAILHPOWERV && tile !== src_tileValues.HRAILROAD &&
            tile !== src_tileValues.HRAIL)
          adjTile |= 1;
      }

      if (x < this._map.width - 1) {
        tile = this._worldEffects.getTileValue(x + 1, y);
        tile = TileUtils.normalizeRoad(tile);
        if (tile >= src_tileValues.RAILHPOWERV && tile <= src_tileValues.VRAILROAD &&
            tile !== src_tileValues.RAILVPOWERH && tile !== src_tileValues.VRAILROAD &&
            tile !== src_tileValues.VRAIL)
          adjTile |= 2;
      }

      if (y < this._map.height - 1) {
        tile = this._worldEffects.getTileValue(x, y + 1);
        tile = TileUtils.normalizeRoad(tile);
        if (tile >= src_tileValues.RAILHPOWERV && tile <= src_tileValues.VRAILROAD &&
            tile !== src_tileValues.RAILHPOWERV && tile !== src_tileValues.HRAILROAD &&
            tile !== src_tileValues.HRAIL)
          adjTile |= 4;
      }

      if (x > 0) {
        tile = this._worldEffects.getTileValue(x - 1, y);
        tile = TileUtils.normalizeRoad(tile);
        if (tile >= src_tileValues.RAILHPOWERV && tile <= src_tileValues.VRAILROAD &&
            tile !== src_tileValues.RAILVPOWERH && tile !== src_tileValues.VRAILROAD &&
            tile !== src_tileValues.VRAIL)
          adjTile |= 8;
      }

    this._worldEffects.setTile(x, y, RailTable[adjTile], src_tileFlags.BULLBIT | src_tileFlags.BURNBIT);
    return;
  }

  if (tile >= src_tileValues.LHPOWER && tile <= src_tileValues.LVPOWER10) {
    if (y > 0) {
      tile = this._worldEffects.getTile(x, y - 1);
      if (tile.isConductive()) {
        tile = tile.getValue();
        tile = TileUtils.normalizeRoad(tile);
        if (tile !== src_tileValues.VPOWER && tile !== src_tileValues.VROADPOWER && tile !== src_tileValues.RAILVPOWERH)
          adjTile |= 1;
      }
    }

    if (x < this._map.width - 1) {
      tile = this._worldEffects.getTile(x + 1, y);
      if (tile.isConductive()) {
        tile = tile.getValue();
        tile = TileUtils.normalizeRoad(tile);
        if (tile !== src_tileValues.HPOWER && tile !== src_tileValues.HROADPOWER && tile !== src_tileValues.RAILHPOWERV)
          adjTile |= 2;
      }
    }

    if (y < this._map.height - 1) {
      tile = this._worldEffects.getTile(x, y + 1);
      if (tile.isConductive()) {
        tile = tile.getValue();
        tile = TileUtils.normalizeRoad(tile);
        if (tile !== src_tileValues.VPOWER && tile !== src_tileValues.VROADPOWER && tile !== src_tileValues.RAILVPOWERH)
          adjTile |= 4;
      }
    }

    if (x > 0) {
      tile = this._worldEffects.getTile(x - 1, y);
      if (tile.isConductive()) {
        tile = tile.getValue();
        tile = TileUtils.normalizeRoad(tile);
        if (tile !== src_tileValues.HPOWER && tile !== src_tileValues.HROADPOWER && tile !== src_tileValues.RAILHPOWERV)
          adjTile |= 8;
      }
    }

    this._worldEffects.setTile(x, y, WireTable[adjTile], src_tileFlags.BLBNCNBIT);
    return;
  }
};


var checkZoneConnections = function(x, y) {
  this.fixSingle(x, y);

  if (y > 0)
    this.fixSingle(x, y - 1);

  if (x < this._map.width - 1)
    this.fixSingle(x + 1, y);

  if (y < this._map.height - 1)
    this.fixSingle(x, y + 1);

  if (x > 0)
    this.fixSingle(x - 1, y);
};


var checkBorder = function(x, y, size) {
  // Adjust to top left tile
  x = x - 1;
  y = y - 1;

  var i;

  for (i = 0; i < size; i++)
    this.fixZone(x + i, y - 1);

  for (i = 0; i < size; i++)
    this.fixZone(x - 1, y + i);

  for (i = 0; i < size; i++)
    this.fixZone(x + i, y + size);

  for (i = 0; i < size; i++)
    this.fixZone(x + size, y + i);
};


// Note that this differs in style from BaseTool. After BaseTool has been called
// on an implementation, we have the following prototype chain:
//   toolConstructor -> {<prototype: empty object>} -> BaseToolImpl
// Following that idiom again would lead to difficulties regarding where to interpose
// the Connector implementation in the prototype chain, as really the BaseTool implementation
// and the Connector implementation should be singleton objects. Instead, we just add the required
// functions to the newly minted prototype
var Connector = function(toolConstructor) {
  toolConstructor.prototype.checkZoneConnections = checkZoneConnections;
  toolConstructor.prototype.fixSingle = fixSingle;
  toolConstructor.prototype.checkBorder = checkBorder;
  return toolConstructor;
};




;// ./src/connectingTool.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */




// Take a tool constructor, make it inherit from BaseTool, and add
// the various connection related functions
var connectingTool_makeTool = BaseTool.makeTool;
var ConnectingTool = function(toolConstructor) {
  return Connector(connectingTool_makeTool(toolConstructor));
};




;// ./src/buildingTool.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */






var BuildingTool = ConnectingTool(function(cost, centreTile, map, size, animated) {
  this.init(cost, map, false);
  this.centreTile = centreTile;
  this.size = size;
  this.animated = animated;
});


BuildingTool.prototype.putBuilding = function(leftX, topY) {
  var posX, posY, tileValue, tileFlags;
  var baseTile = this.centreTile - this.size - 1;

  for (var dy = 0; dy < this.size; dy++) {
    posY = topY + dy;

    for (var dx = 0; dx < this.size; dx++) {
      posX = leftX + dx;
      tileValue = baseTile;
      tileFlags = src_tileFlags.BNCNBIT;

      if (dx === 1) {
        if (dy === 1)
          tileFlags |= src_tileFlags.ZONEBIT;
        else if (dy === 2 && this.animated)
          tileFlags |= src_tileFlags.ANIMBIT;
      }

      this._worldEffects.setTile(posX, posY, tileValue, tileFlags);

      baseTile++;
    }
  }
};


BuildingTool.prototype.prepareBuildingSite = function(leftX, topY) {
  // Check that the entire site is on the map
  if (leftX < 0 || leftX + this.size > this._map.width)
    return this.TOOLRESULT_FAILED;

  if (topY < 0 || topY + this.size > this._map.height)
    return this.TOOLRESULT_FAILED;

  var posX, posY, tileValue;

  // Check whether the tiles are clear
  for (var dy = 0; dy < this.size; dy++) {
    posY = topY + dy;

    for (var dx = 0; dx < this.size; dx++) {
      posX = leftX + dx;

      tileValue = this._worldEffects.getTileValue(posX, posY);

      if (tileValue === src_tileValues.DIRT)
        continue;

      if (!this.autoBulldoze) {
        // No TileValues.DIRT and no bull-dozer => not buildable
        return this.TOOLRESULT_NEEDS_BULLDOZE;
      }

      if (!TileUtils.canBulldoze(tileValue)) {
        // tilevalue cannot be auto-bulldozed
        return this.TOOLRESULT_NEEDS_BULLDOZE;
      }

      this._worldEffects.setTile(posX, posY, src_tileValues.DIRT);
      this.addCost(this.bulldozerCost);
    }
  }

  return this.TOOLRESULT_OK;
};


BuildingTool.prototype.buildBuilding = function(x, y) {
  // Correct to top left
  x--;
  y--;

  var prepareResult = this.prepareBuildingSite(x, y);
  if (prepareResult !== this.TOOLRESULT_OK)
    return prepareResult;

  this.addCost(this.toolCost);

  this.putBuilding(x, y);

  this.checkBorder(x, y);

  return this.TOOLRESULT_OK;
};


BuildingTool.prototype.doTool = function(x, y, blockMaps) {
  this.result = this.buildBuilding(x, y);
};




;// ./src/bulldozerTool.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */










var BulldozerTool = EventEmitter(ConnectingTool(function(map) {
  this.init(10, map, true);
}));


BulldozerTool.prototype.putRubble = function(x, y, size) {
  for (var xx = x; xx < x + size; xx++) {
    for (var yy = y; yy < y + size; yy++)  {
      if (this._map.testBounds(xx, yy)) {
        var tile = this._worldEffects.getTileValue(xx, yy);
        if (tile != src_tileValues.RADTILE && tile != src_tileValues.DIRT)
          this._worldEffects.setTile(xx, yy, src_tileValues.TINYEXP + random.Random.getRandom(2), src_tileFlags.ANIMBIT | src_tileFlags.BULLBIT);
      }
    }
  }
};


BulldozerTool.prototype.layDoze = function(x, y) {
  var tile = this._worldEffects.getTile(x, y);

  if (!tile.isBulldozable())
    return this.TOOLRESULT_FAILED;

  tile = tile.getValue();
  tile = TileUtils.normalizeRoad(tile);

  switch (tile) {
    case src_tileValues.HBRIDGE:
    case src_tileValues.VBRIDGE:
    case src_tileValues.BRWV:
    case src_tileValues.BRWH:
    case src_tileValues.HBRDG0:
    case src_tileValues.HBRDG1:
    case src_tileValues.HBRDG2:
    case src_tileValues.HBRDG3:
    case src_tileValues.VBRDG0:
    case src_tileValues.VBRDG1:
    case src_tileValues.VBRDG2:
    case src_tileValues.VBRDG3:
    case src_tileValues.HPOWER:
    case src_tileValues.VPOWER:
    case src_tileValues.HRAIL:
    case src_tileValues.VRAIL:
      this._worldEffects.setTile(x, y, src_tileValues.RIVER);
      break;

    default:
      this._worldEffects.setTile(x, y, src_tileValues.DIRT);
      break;
  }

  this.addCost(1);

  return this.TOOLRESULT_OK;
};


BulldozerTool.prototype.doTool = function(x, y, blockMaps) {
  if (!this._map.testBounds(x, y))
    this.result = this.TOOLRESULT_FAILED;

  var tile = this._worldEffects.getTile(x, y);
  var tileValue = tile.getValue();

  var zoneSize = 0;
  var deltaX;
  var deltaY;

  if (tile.isZone()) {
    zoneSize = ZoneUtils.checkZoneSize(tileValue);
    deltaX = 0;
    deltaY = 0;
  } else {
    var result = ZoneUtils.checkBigZone(tileValue);
    zoneSize = result.zoneSize;
    deltaX = result.deltaX;
    deltaY = result.deltaY;
  }

  if (zoneSize > 0) {
    this.addCost(this.bulldozerCost);

    var dozeX = x;
    var dozeY = y;
    var centerX = x + deltaX;
    var centerY = y + deltaY;

    switch (zoneSize) {
      case 3:
        this._emitEvent(messages.SOUND_EXPLOSIONHIGH);
        this.putRubble(centerX - 1, centerY - 1, 3);
        break;

      case 4:
        this._emitEvent(messages.SOUND_EXPLOSIONLOW);
        this.putRubble(centerX - 1, centerY - 1, 4);
        break;

      case 6:
        this._emitEvent(messages.SOUND_EXPLOSIONHIGH);
        this._emitEvent(messages.SOUND_EXPLOSIONLOW);
        this.putRubble(centerX - 1, centerY - 1, 6);
        break;
    }

    this.result = this.TOOLRESULT_OK;
  } else {
    var toolResult;
    if (tileValue === src_tileValues.RIVER || tileValue === src_tileValues.REDGE || tileValue === src_tileValues.CHANNEL) {
      toolResult = this.layDoze(x, y);

      if (tileValue !== this._worldEffects.getTileValue(x, y))
        this.addCost(5);
    } else {
      toolResult =  this.layDoze(x, y);
      this.checkZoneConnections(x, y);
    }

    this.result = toolResult;
  }
};




;// ./src/parkTool.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */







var parkTool_makeTool = BaseTool.makeTool;
var ParkTool = parkTool_makeTool(function(map) {
  this.init(10, map, true);
});


ParkTool.prototype.doTool = function(x, y, blockMaps) {
  if (this._worldEffects.getTileValue(x, y) !== src_tileValues.DIRT) {
    this.result = this.TOOLRESULT_NEEDS_BULLDOZE;
    return;
  }

  var value = random.Random.getRandom(4);
  var tileFlags = src_tileFlags.BURNBIT | src_tileFlags.BULLBIT;
  var tileValue;

  if (value === 4) {
    tileValue = src_tileValues.FOUNTAIN;
    tileFlags |= src_tileFlags.ANIMBIT;
  } else {
    tileValue = value + src_tileValues.WOODS2;
  }

  this._worldEffects.setTile(x, y, tileValue, tileFlags);
  this.addCost(10);
  this.result = this.TOOLRESULT_OK;
};




;// ./src/railTool.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */






var RailTool = ConnectingTool(function(map) {
  this.init(20, map, true, true);
});


RailTool.prototype.layRail = function(x, y) {
  this.doAutoBulldoze(x, y);
  var tile = this._worldEffects.getTileValue(x, y);
  tile = TileUtils.normalizeRoad(tile);
  var cost = this.toolCost;

  switch (tile) {
    case src_tileValues.DIRT:
      this._worldEffects.setTile(x, y, src_tileValues.LHRAIL, src_tileFlags.BULLBIT | src_tileFlags.BURNBIT);
      break;

    case src_tileValues.RIVER:
    case src_tileValues.REDGE:
    case src_tileValues.CHANNEL:
        cost = 100;

        if (x < this._map.width - 1) {
          tile = this._worldEffects.getTileValue(x + 1, y);
          tile = TileUtils.normalizeRoad(tile);
          if (tile == src_tileValues.RAILHPOWERV || tile == src_tileValues.HRAIL ||
              (tile >= src_tileValues.LHRAIL && tile <= src_tileValues.HRAILROAD)) {
            this._worldEffects.setTile(x, y, src_tileValues.HRAIL, src_tileFlags.BULLBIT);
            break;
          }
        }

        if (x > 0) {
          tile = this._worldEffects.getTileValue(x - 1, y);
          tile = TileUtils.normalizeRoad(tile);
          if (tile == src_tileValues.RAILHPOWERV || tile == src_tileValues.HRAIL ||
              (tile > src_tileValues.VRAIL && tile < src_tileValues.VRAILROAD)) {
            this._worldEffects.setTile(x, y, src_tileValues.HRAIL, src_tileFlags.BULLBIT);
            break;
          }
        }

        if (y < this._map.height - 1) {
          tile = this._worldEffects.getTileValue(x, y + 1);
          tile = TileUtils.normalizeRoad(tile);
          if (tile == src_tileValues.RAILVPOWERH || tile == src_tileValues.VRAILROAD ||
              (tile > src_tileValues.HRAIL && tile < src_tileValues.HRAILROAD)) {
            this._worldEffects.setTile(x, y, src_tileValues.VRAIL, src_tileFlags.BULLBIT);
            break;
          }
        }

        if (y > 0) {
          tile = this._worldEffects.getTileValue(x, y - 1);
          tile = TileUtils.normalizeRoad(tile);
          if (tile == src_tileValues.RAILVPOWERH || tile == src_tileValues.VRAILROAD ||
              (tile > src_tileValues.HRAIL && tile < src_tileValues.HRAILROAD)) {
            this._worldEffects.setTile(x, y, src_tileValues.VRAIL, src_tileFlags.BULLBIT);
            break;
          }
        }

        return this.TOOLRESULT_FAILED;

      case src_tileValues.LHPOWER:
        this._worldEffects.setTile(x, y, src_tileValues.RAILVPOWERH, src_tileFlags.CONDBIT | src_tileFlags.BURNBIT | src_tileFlags.BULLBIT);
        break;

      case src_tileValues.LVPOWER:
        this._worldEffects.setTile(x, y, src_tileValues.RAILHPOWERV, src_tileFlags.CONDBIT | src_tileFlags.BURNBIT | src_tileFlags.BULLBIT);
        break;

      case src_tileValues.ROADS:
        this._worldEffects.setTile(x, y, src_tileValues.VRAILROAD, src_tileFlags.BURNBIT | src_tileFlags.BULLBIT);
        break;

      case src_tileValues.ROADS2:
        this._worldEffects.setTile(x, y, src_tileValues.HRAILROAD, src_tileFlags.BURNBIT | src_tileFlags.BULLBIT);
        break;

      default:
        return this.TOOLRESULT_FAILED;
    }

    this.addCost(cost);
    this.checkZoneConnections(x, y);
    return this.TOOLRESULT_OK;
};



RailTool.prototype.doTool = function(x, y, blockMaps) {
  this.result = this.layRail(x, y);
};




;// ./src/roadTool.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */






var RoadTool = ConnectingTool(function(map) {
  this.init(10, map, true, true);
});


RoadTool.prototype.layRoad = function(x, y) {
  this.doAutoBulldoze(x, y);
  var tile = this._worldEffects.getTileValue(x, y);
  var cost = this.toolCost;

  switch (tile) {
    case src_tileValues.DIRT:
      this._worldEffects.setTile(x, y, src_tileValues.ROADS, src_tileFlags.BULLBIT | src_tileFlags.BURNBIT);
      break;

    case src_tileValues.RIVER:
    case src_tileValues.REDGE:
    case src_tileValues.CHANNEL:
      cost = 50;

      if (x < this._map.width - 1) {
        tile = this._worldEffects.getTileValue(x + 1, y);
        tile = TileUtils.normalizeRoad(tile);

        if (tile === src_tileValues.VRAILROAD || tile === src_tileValues.HBRIDGE ||
            (tile >= src_tileValues.ROADS && tile <= src_tileValues.HROADPOWER)) {
          this._worldEffects.setTile(x, y, src_tileValues.HBRIDGE, src_tileFlags.BULLBIT);
          break;
        }
      }

      if (x > 0) {
        tile = this._worldEffects.getTileValue(x - 1, y);
        tile = TileUtils.normalizeRoad(tile);

        if (tile === src_tileValues.VRAILROAD || tile === src_tileValues.HBRIDGE ||
            (tile >= src_tileValues.ROADS && tile <= src_tileValues.INTERSECTION)) {
          this._worldEffects.setTile(x, y, src_tileValues.HBRIDGE, src_tileFlags.BULLBIT);
          break;
        }
      }

      if (y < this._map.height - 1) {
        tile = this._worldEffects.getTileValue(x, y + 1);
        tile = TileUtils.normalizeRoad(tile);

        if (tile === src_tileValues.HRAILROAD || tile === src_tileValues.VROADPOWER ||
            (tile >= src_tileValues.VBRIDGE && tile <= src_tileValues.INTERSECTION)) {
          this._worldEffects.setTile(x, y, src_tileValues.VBRIDGE, src_tileFlags.BULLBIT);
          break;
        }
      }

      if (y > 0) {
        tile = this._worldEffects.getTileValue(x, y - 1);
        tile = TileUtils.normalizeRoad(tile);

        if (tile === src_tileValues.HRAILROAD || tile === src_tileValues.VROADPOWER ||
            (tile >= src_tileValues.VBRIDGE && tile <= src_tileValues.INTERSECTION)) {
          this._worldEffects.setTile(x, y, src_tileValues.VBRIDGE, src_tileFlags.BULLBIT);
          break;
        }
      }

      return this.TOOLRESULT_FAILED;

    case src_tileValues.LHPOWER:
      this._worldEffects.setTile(x, y, src_tileValues.VROADPOWER, src_tileFlags.CONDBIT | src_tileFlags.BURNBIT | src_tileFlags.BULLBIT);
      break;

    case src_tileValues.LVPOWER:
      this._worldEffects.setTile(x, y, src_tileValues.HROADPOWER, src_tileFlags.CONDBIT | src_tileFlags.BURNBIT | src_tileFlags.BULLBIT);
      break;

    case src_tileValues.LHRAIL:
      this._worldEffects.setTile(x, y, src_tileValues.HRAILROAD, src_tileFlags.BURNBIT | src_tileFlags.BULLBIT);
      break;

    case src_tileValues.LVRAIL:
      this._worldEffects.setTile(x, y, src_tileValues.VRAILROAD, src_tileFlags.BURNBIT | src_tileFlags.BULLBIT);
      break;

    default:
      return this.TOOLRESULT_FAILED;
  }

  this.addCost(cost);
  this.checkZoneConnections(x, y);
  return this.TOOLRESULT_OK;
};


RoadTool.prototype.doTool = function(x, y, blockMaps) {
  this.result = this.layRoad(x, y);
};




;// ./src/queryTool.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */










var queryTool_makeTool = BaseTool.makeTool;
var QueryTool = EventEmitter(queryTool_makeTool(function(map) {
  this.init(0, map, false, false);
}));


QueryTool.prototype.classifyPopulationDensity = function(x, y, blockMaps) {
  var density = blockMaps.populationDensityMap.worldGet(x, y);
  if (Config.debug || Config.queryDebug)
    jquery('#queryDensityRaw').text(density);
  density = density >> 6;
  density = density & 3;
  jquery('#queryDensity').text(Text.densityStrings[density]);
};


QueryTool.prototype.classifyLandValue = function(x, y, blockMaps) {
   var landValue = blockMaps.landValueMap.worldGet(x, y);
   if (Config.debug || Config.queryDebug)
     jquery('#queryLandValueRaw').text(landValue);

   var i = 0;
   if (landValue >= 150)
     i = 3;
   else if (landValue >= 80)
     i = 2;
   else if (landValue >= 30)
     i = 1;

   var text = Text.landValueStrings[i];
   jquery('#queryLandValue').text(text);
};


QueryTool.prototype.classifyCrime = function(x, y, blockMaps) {
  var crime = blockMaps.crimeRateMap.worldGet(x, y);
  if (Config.debug || Config.queryDebug)
    jquery('#queryCrimeRaw').text(crime);
  crime = crime >> 6;
  crime = crime & 3;
  jquery('#queryCrime').text(Text.crimeStrings[crime]);
};


QueryTool.prototype.classifyPollution = function(x, y, blockMaps) {
  var pollution = blockMaps.pollutionDensityMap.worldGet(x, y);
  if (Config.debug || Config.queryDebug)
    jquery('#queryPollutionRaw').text(pollution);
  pollution = pollution >> 6;
  pollution = pollution & 3;
  jquery('#queryPollution').text(Text.pollutionStrings[pollution]);
};


QueryTool.prototype.classifyRateOfGrowth = function(x, y, blockMaps) {
  var rate = blockMaps.rateOfGrowthMap.worldGet(x, y);
  if (Config.debug || Config.queryDebug)
    jquery('#queryRateRaw').text(rate);
  rate = rate >> 6;
  rate = rate & 3;
  jquery('#queryRate').text(Text.rateStrings[rate]);
};


QueryTool.prototype.classifyDebug = function(x, y, blockMaps) {
  if (!Config.debug && !Config.queryDebug)
    return;
  jquery('#queryFireStationRaw').text(blockMaps.fireStationMap.worldGet(x, y));
  jquery('#queryFireStationEffectRaw').text(blockMaps.fireStationEffectMap.worldGet(x, y));
  jquery('#queryPoliceStationRaw').text(blockMaps.policeStationMap.worldGet(x, y));
  jquery('#queryPoliceStationEffectRaw').text(blockMaps.policeStationEffectMap.worldGet(x, y));
  jquery('#queryTerrainDensityRaw').text(blockMaps.terrainDensityMap.worldGet(x, y));
  jquery('#queryTrafficDensityRaw').text(blockMaps.trafficDensityMap.worldGet(x, y));
  jquery('#queryComRateRaw').text(blockMaps.cityCentreDistScoreMap.worldGet(x, y));
};


QueryTool.prototype.classifyZone = function(x, y) {
  var baseTiles = [
      src_tileValues.DIRT, src_tileValues.RIVER, src_tileValues.TREEBASE, src_tileValues.RUBBLE,
      src_tileValues.FLOOD, src_tileValues.RADTILE, src_tileValues.FIRE, src_tileValues.ROADBASE,
      src_tileValues.POWERBASE, src_tileValues.RAILBASE, src_tileValues.RESBASE, src_tileValues.COMBASE,
      src_tileValues.INDBASE, src_tileValues.PORTBASE, src_tileValues.AIRPORTBASE, src_tileValues.COALBASE,
      src_tileValues.FIRESTBASE, src_tileValues.POLICESTBASE, src_tileValues.STADIUMBASE, src_tileValues.NUCLEARBASE,
      src_tileValues.HBRDG0, src_tileValues.RADAR0, src_tileValues.FOUNTAIN, src_tileValues.INDBASE2,
      src_tileValues.FOOTBALLGAME1, src_tileValues.VBRDG0, 952];

  var tileValue = this._map.getTileValue(x, y);
  if (tileValue >= src_tileValues.COALSMOKE1 && tileValue < src_tileValues.FOOTBALLGAME1)
    tileValue = src_tileValues.COALBASE;

  var index, l;
  for (index = 0, l = baseTiles.length - 1; index < l; index++) {
    if (tileValue < baseTiles[index + 1])
      break;
  }

  jquery('#queryZoneType').text(Text.zoneTypes[index]);
};


QueryTool.prototype.doTool = function(x, y, blockMaps) {
  var text = 'Position (' + x + ', ' + y + ')';
  text += ' TileValue: ' + this._map.getTileValue(x, y);

  if (Config.debug || Config.queryDebug) {
    var tile = this._map.getTile(x, y);
    jquery('#queryTile').text([x,y].join(', '));
    jquery('#queryTileValue').text(tile.getValue());
    jquery('#queryTileBurnable').text(tile.isCombustible() ? '\u2714' : '\u2718');
    jquery('#queryTileBulldozable').text(tile.isBulldozable() ? '\u2714' : '\u2718');
    jquery('#queryTileCond').text(tile.isConductive() ? '\u2714' : '\u2718');
    jquery('#queryTileAnim').text(tile.isAnimated() ? '\u2714' : '\u2718');
    jquery('#queryTilePowered').text(tile.isPowered() ? '\u2714' : '\u2718');
    jquery('#queryTileZone').text(tile.isZone() ? '\u2714' : '\u2718');
  }

  this.classifyZone(x, y);
  this.classifyPopulationDensity(x, y, blockMaps);
  this.classifyLandValue(x, y, blockMaps);
  this.classifyCrime(x, y, blockMaps);
  this.classifyPollution(x, y, blockMaps);
  this.classifyRateOfGrowth(x, y, blockMaps);
  this.classifyDebug(x, y, blockMaps);

  this._emitEvent(messages.QUERY_WINDOW_NEEDED);

  this.result = this.TOOLRESULT_OK;
};




;// ./src/wireTool.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */






var WireTool = ConnectingTool(function(map) {
  this.init(5, map, true, true);
});


WireTool.prototype.layWire = function(x, y) {
  this.doAutoBulldoze(x, y);
  var cost = this.toolCost;

  var tile = this._worldEffects.getTileValue(x, y);
  tile = TileUtils.normalizeRoad(tile);

  switch (tile) {
    case src_tileValues.DIRT:
      this._worldEffects.setTile(x, y, src_tileValues.LHPOWER, src_tileFlags.CONDBIT | src_tileFlags.BURNBIT | src_tileFlags.BULLBIT);
      break;

    case src_tileValues.RIVER:
    case src_tileValues.REDGE:
    case src_tileValues.CHANNEL:
      cost = 25;

      if (x < this._map.width - 1) {
        tile = this._worldEffects.getTile(x + 1, y);
        if (tile.isConductive()) {
          tile = tile.getValue();
          tile = TileUtils.normalizeRoad(tile);
          if (tile != src_tileValues.HROADPOWER && tile != src_tileValues.RAILHPOWERV && tile != src_tileValues.HPOWER) {
            this._worldEffects.setTile(x, y, src_tileValues.VPOWER, src_tileFlags.CONDBIT | src_tileFlags.BULLBIT);
            break;
          }
        }
      }

      if (x > 0) {
        tile = this._worldEffects.getTile(x - 1, y);
        if (tile.isConductive()) {
          tile = tile.getValue();
          tile = TileUtils.normalizeRoad(tile);
          if (tile != src_tileValues.HROADPOWER && tile != src_tileValues.RAILHPOWERV && tile != src_tileValues.HPOWER) {
            this._worldEffects.setTile(x, y, src_tileValues.VPOWER, src_tileFlags.CONDBIT | src_tileFlags.BULLBIT);
            break;
          }
        }
      }

      if (y < this._map.height - 1) {
        tile = this._worldEffects.getTile(x, y + 1);
        if (tile.isConductive()) {
          tile = tile.getValue();
          tile = TileUtils.normalizeRoad(tile);
          if (tile != src_tileValues.VROADPOWER && tile != src_tileValues.RAILVPOWERH && tile != src_tileValues.VPOWER) {
            this._worldEffects.setTile(x, y, src_tileValues.HPOWER, src_tileFlags.CONDBIT | src_tileFlags.BULLBIT);
            break;
          }
        }
      }

      if (y > 0) {
        tile = this._worldEffects.getTile(x, y - 1);
        if (tile.isConductive()) {
          tile = tile.getValue();
          tile = TileUtils.normalizeRoad(tile);
          if (tile != src_tileValues.VROADPOWER && tile != src_tileValues.RAILVPOWERH && tile != src_tileValues.VPOWER) {
            this._worldEffects.setTile(x, y, src_tileValues.HPOWER, src_tileFlags.CONDBIT | src_tileFlags.BULLBIT);
            break;
          }
        }
      }

      return this.TOOLRESULT_FAILED;

    case src_tileValues.ROADS:
      this._worldEffects.setTile(x, y, src_tileValues.HROADPOWER, src_tileFlags.CONDBIT | src_tileFlags.BURNBIT | src_tileFlags.BULLBIT);
      break;

    case src_tileValues.ROADS2:
      this._worldEffects.setTile(x, y, src_tileValues.VROADPOWER, src_tileFlags.CONDBIT | src_tileFlags.BURNBIT | src_tileFlags.BULLBIT);
      break;

    case src_tileValues.LHRAIL:
      this._worldEffects.setTile(x, y, src_tileValues.RAILHPOWERV, src_tileFlags.CONDBIT | src_tileFlags.BURNBIT | src_tileFlags.BULLBIT);
      break;

    case src_tileValues.LVRAIL:
      this._worldEffects.setTile(x, y, src_tileValues.RAILVPOWERH, src_tileFlags.CONDBIT | src_tileFlags.BURNBIT | src_tileFlags.BULLBIT);
      break;

    default:
      return this.TOOLRESULT_FAILED;
  }

  this.addCost(cost);
  this.checkZoneConnections(x, y);
  return this.TOOLRESULT_OK;
};


WireTool.prototype.doTool = function(x, y, blockMaps) {
  this.result = this.layWire(x, y);
};




;// ./src/gameTools.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */













function GameTools(map) {
  var tools = EventEmitter({
    airport: new BuildingTool(10000, src_tileValues.AIRPORT, map, 6, false),
    bulldozer: new BulldozerTool(map),
    coal: new BuildingTool(3000, src_tileValues.POWERPLANT, map, 4, false),
    commercial: new BuildingTool(100, src_tileValues.COMCLR, map, 3, false),
    fire: new BuildingTool(500, src_tileValues.FIRESTATION, map, 3, false),
    industrial: new BuildingTool(100, src_tileValues.INDCLR, map, 3, false),
    nuclear: new BuildingTool(5000, src_tileValues.NUCLEAR, map, 4, true),
    park: new ParkTool(map),
    police: new BuildingTool(500, src_tileValues.POLICESTATION, map, 3, false),
    port: new BuildingTool(3000, src_tileValues.PORT, map, 4, false),
    rail: new RailTool(map),
    residential: new BuildingTool(100, src_tileValues.FREEZ, map, 3, false),
    road: new RoadTool(map),
    query: new QueryTool(map),
    stadium: new BuildingTool(5000, src_tileValues.STADIUM, map, 4, false),
    wire: new WireTool(map),
  });

  tools.query.addEventListener(messages.QUERY_WINDOW_NEEDED, MiscUtils.reflectEvent.bind(tools, messages.QUERY_WINDOW_NEEDED));

  return tools;
}




;// ./src/inputStatus.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */









var InputStatus = EventEmitter(function(map, tileWidth) {
  this.gameTools = new GameTools(map);

  this.gameTools.addEventListener(messages.QUERY_WINDOW_NEEDED, MiscUtils.reflectEvent.bind(this, messages.QUERY_WINDOW_NEEDED));

  this.canvasID = MiscUtils.normaliseDOMid(canvasID);

  this._tileWidth = tileWidth;

  // Keyboard Movement
  this.up = false;
  this.down = false;
  this.left = false;
  this.right = false;
  this.escape = false;

  // Mouse movement
  this.mouseX = -1;
  this.mouseY = -1;

  // Mouse drags
  this._dragging = false;
  this._lastdragX = -1;
  this._lastdragY = -1;

  // Tool buttons
  this.toolName = null;
  this.currentTool = null;
  this.toolWidth = 0;
  this.toolColour = '';

  // Add the listeners
  jquery(document).keydown(keyDownHandler.bind(this));
  jquery(document).keyup(keyUpHandler.bind(this));

  this.getRelativeCoordinates = getRelativeCoordinates.bind(this);
  jquery(this.canvasID).on('mouseenter', mouseEnterHandler.bind(this));
  jquery(this.canvasID).on('mouseleave', mouseLeaveHandler.bind(this));

  this.mouseDownHandler = mouseDownHandler.bind(this);
  this.mouseMoveHandler = mouseMoveHandler.bind(this);
  this.mouseUpHandler = mouseUpHandler.bind(this);
  this.canvasClickHandler = canvasClickHandler.bind(this);

  jquery('.toolButton').click(toolButtonHandler.bind(this));
  jquery('#budgetRequest').click(budgetHandler.bind(this));
  jquery('#evalRequest').click(evalHandler.bind(this));
  jquery('#disasterRequest').click(disasterHandler.bind(this));
  jquery('#pauseRequest').click(this.speedChangeHandler.bind(this));
  jquery('#screenshotRequest').click(screenshotHandler.bind(this));
  jquery('#settingsRequest').click(settingsHandler.bind(this));
  jquery('#saveRequest').click(saveHandler.bind(this));
  jquery('#debugRequest').click(debugHandler.bind(this));
});


var canvasID = '#' + GameCanvas.DEFAULT_ID;
var toolOutputID = '#toolOutput';


var keyDownHandler = function(e) {
  var handled = false;

  switch (e.keyCode) {
    case 38:
    case 87:
      this.up = true;
      handled = true;
      break;

    case 40:
    case 83:
      this.down = true;
      handled = true;
      break;

    case 39:
    case 68:
      this.right = true;
      handled = true;
      break;

    case 37:
    case 65:
      this.left = true;
      handled = true;
      break;

    case 27:
      this.escape = true;
      handled = true;
  }

  if (handled)
    e.preventDefault();
};


var keyUpHandler = function(e) {
  switch (e.keyCode) {
    case 38:
    case 87:
      this.up = false;
      break;

    case 40:
    case 83:
      this.down = false;
      break;

    case 39:
    case 68:
      this.right = false;
      break;

    case 37:
    case 65:
      this.left = false;
      break;

    case 27:
      this.escape = false;
  }
};


var getRelativeCoordinates = function(e) {
  var cRect = document.querySelector(this.canvasID).getBoundingClientRect();
  return {x: e.clientX - cRect.left, y: e.clientY - cRect.top};
};


var mouseEnterHandler = function(e) {
  if (this.currentTool === null)
    return;

  jquery(this.canvasID).on('mousemove', this.mouseMoveHandler);

  if (this.currentTool.isDraggable)
    jquery(this.canvasID).on('mousedown', this.mouseDownHandler);
  else
    jquery(this.canvasID).on('click', this.canvasClickHandler);
};


var mouseDownHandler = function(e) {
  if (e.which !== 1 || e.shiftKey || e.altKey || e.ctrlKey || e.metaKey)
    return;

  var coords = this.getRelativeCoordinates(e);
  this.mouseX = coords.x;
  this.mouseY = coords.y;

  this._dragging = true;
  this._emitEvent(messages.TOOL_CLICKED, {x: this.mouseX, y: this.mouseY});

  this._lastDragX = Math.floor(this.mouseX / this._tileWidth);
  this._lastDragY = Math.floor(this.mouseY / this._tileWidth);

  jquery(this.canvasID).on('mouseup', this.mouseUpHandler);
  e.preventDefault();
};


var mouseUpHandler = function(e) {
  this._dragging = false;
  this._lastDragX = -1;
  this._lastDragY = -1;
  jquery(this.canvasID).off('mouseup');
  e.preventDefault();
};


var mouseLeaveHandler = function(e) {
  jquery(this.canvasID).off('mousedown');
  jquery(this.canvasID).off('mousemove');
  jquery(this.canvasID).off('mouseup');

  // Watch out: we might have been mid-drag
  if (this._dragging) {
    this._dragging = false;
    this._lastDragX = -1;
    this._lastDragY = -1;
  }

  jquery(this.canvasID).off('click');

  this.mouseX = -1;
  this.mouseY = -1;
};


var mouseMoveHandler = function(e) {
  var coords = this.getRelativeCoordinates(e);
  this.mouseX = coords.x;
  this.mouseY = coords.y;

  if (this._dragging) {
    // XXX Work up how to patch up the path for fast mouse moves. My first attempt was too slow, and ended up missing
    // mouseUp events
    var x = Math.floor(this.mouseX / this._tileWidth);
    var y = Math.floor(this.mouseY / this._tileWidth);

    var lastX = this._lastDragX;
    var lastY = this._lastDragY;
    if (x !== lastX || y !== lastY) {
      this._emitEvent(messages.TOOL_CLICKED, {x: this.mouseX, y: this.mouseY});
      this._lastDragX = x;
      this._lastDragY = y;
    }
  }
};


var canvasClickHandler = function(e) {
  if (e.which !== 1 || e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || this.mouseX === -1 ||
     this._mouseY === -1 || this._dragging)
    return;

  this._emitEvent(messages.TOOL_CLICKED, {x: this.mouseX, y: this.mouseY});
  e.preventDefault();
};


var toolButtonHandler = function(e) {
  // Remove highlight from last tool button
  jquery('.selected').each(function() {
    jquery(this).removeClass('selected');
    jquery(this).addClass('unselected');
  });

  // Add highlight
  jquery(e.target).removeClass('unselected');
  jquery(e.target).addClass('selected');

  this.toolName = jquery(e.target).attr('data-tool');
  this.toolWidth = jquery(e.target).attr('data-size');
  this.currentTool = this.gameTools[this.toolName];
  this.toolColour = jquery(e.target).attr('data-colour');
  jquery(toolOutputID).html('Tools');

  if (this.toolName !== 'query') {
    jquery(this.canvasID).removeClass('helpPointer');
    jquery(this.canvasID).addClass('pointer');
  } else {
    jquery(this.canvasID).removeClass('pointer');
    jquery(this.canvasID).addClass('helpPointer');
  }

  e.preventDefault();
};


InputStatus.prototype.speedChangeHandler = function(e) {
  var requestedSpeed = jquery('#pauseRequest').text();
  var newRequest = requestedSpeed === 'Pause' ? 'Play' : 'Pause';
  jquery('#pauseRequest').text(newRequest);
  this._emitEvent(messages.SPEED_CHANGE, requestedSpeed);
};


InputStatus.prototype.clearTool = function() {
  if (this.toolName === 'query') {
    jquery(this.canvasID).removeClass('helpPointer');
    jquery(this.canvasID).addClass('pointer');
  }

  this.currentTool = null;
  this.toolWidth = 0;
  this.toolColour = '';
  jquery('.selected').removeClass('selected');
};


var makeHandler = function(message) {
  var m = messages_namespaceObject[message];

  return function(e) {
    this._emitEvent(m);
  };
};


var budgetHandler = makeHandler('BUDGET_REQUESTED');
var debugHandler = makeHandler('DEBUG_WINDOW_REQUESTED');
var disasterHandler = makeHandler('DISASTER_REQUESTED');
var evalHandler = makeHandler('EVAL_REQUESTED');
var screenshotHandler = makeHandler('SCREENSHOT_WINDOW_REQUESTED');
var settingsHandler = makeHandler('SETTINGS_WINDOW_REQUESTED');
var saveHandler = makeHandler('SAVE_REQUESTED');




;// ./src/monsterTV.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */







var TIMEOUT_SECS = 10;


var MonsterTV = function(map, tileSet, spriteSheet, animationManager) {
  this.isOpen = false;
  this._tracking = null;

  // Need to quickly flick on the canvas container so the canvas picks up the correct dimensions (this is a bit of a
  // hack as we're reusing the same GameCanvas that paints the main map, but it avoids a lot of duplication)
  jquery(monsterTVID).toggle();

  this.canvas = new GameCanvas(monsterTVCanvasID, monsterTVContainerID);
  this.canvas.init(map, tileSet, spriteSheet, animationManager);
  this.canvas.disallowOffMap();

  this._onMove = onMove.bind(this);
  this._onDie = onDie.bind(this);
  this._timeout = null;

  jquery(monsterTVID).toggle();
  this.close = monsterTV_close.bind(this);
  jquery(monsterTVFormID).on('submit', this.close);
};


var monsterTVFormID = '#monsterTVForm';
var monsterTVContainerID = '#tvContainer';
var monsterTVCanvasID = '#tvCanvas';
var monsterTVID = '#monstertv';


var monsterTV_close = function(e) {
  if (e)
    e.preventDefault();

  this.isOpen = false;
  jquery(monsterTVID).toggle();
};


MonsterTV.prototype.paint = function(sprite, isPaused) {
  if (!this.isOpen)
    return;

  this.canvas.paint(null, sprite, isPaused);
};


var onMove = function(event) {
  var min = this.canvas.getTileOrigin();
  var max = this.canvas.getMaxTile();

  if (event.x < min.x || event.y < min.y || event.x >= max.x || event.y >= max.y)
    this.canvas.centreOn(event.x, event.y);
};


var onDie = function(event) {
  this._tracking.removeEventListener(messages.SPRITE_MOVED, this._onMove);
  this._tracking.removeEventListener(messages.SPRITE_DYING, this._onDie);
  this._tracking = null;

  this._timeout = window.setTimeout(function() {this._timeout = null; this.close();}.bind(this), TIMEOUT_SECS * 1000);
};


MonsterTV.prototype.track = function(x, y, sprite) {
  if (this._tracking !== null) {
    this._tracking.removeEventListener(messages.SPRITE_MOVED, this._onMove);
    this._tracking.removeEventListener(messages.SPRITE_DYING, this._onDie);
  }

  this._tracking = sprite;
  sprite.addEventListener(messages.SPRITE_MOVED, this._onMove);
  sprite.addEventListener(messages.SPRITE_DYING, this._onDie);
  this.canvas.centreOn(x, y);

  if (this._timeout !== null) {
    window.clearTimeout(this._timeout);
    this._timeout = null;
  }

  if (this.isOpen)
    return;

  this.open();
};


MonsterTV.prototype.show = function(x, y) {
  this.canvas.centreOn(x, y);

  if (this._timeout !== null) {
    window.clearTimeout(this._timeout);
    this._timeout = null;
  }

  if (this.isOpen)
    return;

  this.open();
};


MonsterTV.prototype.open = function(message) {
  this.isOpen = true;
  jquery(monsterTVID).toggle();
};




;// ./src/nagWindow.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */






var NagWindow = ModalWindow(function() {
  jquery(nagFormID).on('submit', nagWindow_submit.bind(this));
});


var nagFormID = '#nagForm';
var nagOKID = '#nagOK';


var nagWindow_submit = function(e) {
  e.preventDefault();
  this.close();
};


NagWindow.prototype.close = function() {
  this._toggleDisplay();
  this._emitEvent(messages.NAG_WINDOW_CLOSED);
};


NagWindow.prototype.open = function() {
  this._toggleDisplay();
  jquery(nagOKID).focus();
};




;// ./src/notification.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */






var notification_TIMEOUT_SECS = 30;


function Notification(element, map, initialText) {
  element = MiscUtils.normaliseDOMid(element);

  this._map = map;
  this._element = jquery(element);
  this._timeout = null;

  this._handleClick = handleClick.bind(this);

  // The position to centre on when the link is clicked
  this._x = -1;
  this._y = -1;

  this._element.click(this._handleClick);
  this.close = notification_close.bind(this);
  if (this._element.is(':visible'))
    this._element.toggle();
}


var notification_close = function(e) {
  if (e)
    e.preventDefault();

  if (this._element.is(':visible'))
    this._element.toggle();
};


Notification.prototype._displayLink = function(text, x, y) {
  if (this._timeout !== null) {
    window.clearTimeout(this._timeout);
    this._timeout = null;
  }

  this._element.text(text);

  this._x = x;
  this._y = y;

  this._element.addClass('pointer');

  if (!this._element.is(':visible'))
    this._element.toggle();

  this._timeout = window.setTimeout(function() {this._timeout = null; this.close();}.bind(this), notification_TIMEOUT_SECS * 1000);
};


Notification.prototype._displayText = function(text, x, y) {
  if (this._timeout !== null) {
    window.clearTimeout(this._timeout);
    this._timeout = null;
  }

  this._element.removeClass('pointer');
  this._element.text(text);
  this._x = -1;
  this._y = -1;

  if (!this._element.is(':visible'))
    this._element.toggle();

  this._timeout = window.setTimeout(function() {this._timeout = null; this.close();}.bind(this), notification_TIMEOUT_SECS * 1000);
};


var handleClick = function(e) {
  e.preventDefault();

  if (this._x === -1 || this._y === -1)
    return;

  this._map.centreOn(this._x, this._y);
};


Notification.prototype.createMessage = function(message) {

  if (message.hasOwnProperty('data') && message.data !== undefined && message.data.hasOwnProperty('x') && message.data.hasOwnProperty('y')) {
    this._displayLink(Text.messageText[message.subject], message.data.x, message.data.y);
    return;
  }

  this._displayText(Text.messageText[message.subject]);
};


Notification.prototype.badNews = function(message) {
  this._element.removeClass('neutral');
  this._element.removeClass('good');
  this._element.addClass('bad');
  this.createMessage(message);
};


Notification.prototype.goodNews = function(message) {
  this._element.removeClass('neutral');
  this._element.removeClass('bad');
  this._element.addClass('good');
  this.createMessage(message);
};


Notification.prototype.news = function(message) {
  this._element.removeClass('good');
  this._element.removeClass('bad');
  this._element.addClass('neutral');
  this.createMessage(message);
};




;// ./src/queryWindow.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */








var QueryWindow = ModalWindow(function() {
  this._debugToggled = false;
  jquery(queryFormID).on('submit', queryWindow_submit.bind(this));
});


var queryFormID = '#queryForm';
var queryOKID = '#queryOK';


var queryWindow_submit = function(e) {
  e.preventDefault();
  this.close();
};


QueryWindow.prototype.close = function() {
  this._toggleDisplay();
  this._emitEvent(messages.QUERY_WINDOW_CLOSED);
};


QueryWindow.prototype.open = function() {
  if ((Config.debug || Config.queryDebug) && !this._debugToggled) {
    this._debugToggled = true;
    jquery('.queryDebug').removeClass('hidden');
  }

  this._toggleDisplay();
  jquery(queryOKID).focus();
};




;// ./src/rci.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */






function RCI(parentNode, eventSource, id) {
  if (arguments.length < 2)
    throw new Error('RCI constructor called with too few arguments ' + [].toString.apply(arguments));

  if (id === undefined)
    id = RCI.DEFAULT_ID;

  if (typeof(parentNode) === 'string') {
    var orig = parentNode;
    parentNode = jquery(MiscUtils.normaliseDOMid(parentNode));
    parentNode = parentNode.length === 0 ? null : parentNode[0];
    if (parentNode === null)
      throw new Error('Node ' + orig + ' not found');
  }

  // Each bar is 1 unit of padding wide, and there are 2 units
  // of padding between the 3 bars. There are 2 units of padding
  // either side. So 9 units of padding total
  // Each bar can be at most bucket rectangles tall, but we multiply
  // that by 2 as we can have positive and negative directions. There
  // should be 1 unit of padding either side. The text box in the middle
  // is 1 unit of padding
  this._padding = 3; // 3 rectangles in each bit of padding
  this._buckets = 10; // 0.2000 is scaled in to 10 buckets
  this._rectSize = 5; // Each rect is 5px
  this._scale = Math.floor(2000 / this._buckets);

  this._canvas = jquery('<canvas></canvas>', {id: id})[0];

  // Remove any existing element with the same id
  var elems = jquery(MiscUtils.normaliseDOMid(id));
  var current = elems.length > 0 ? elems[0] : null;
  if (current !== null) {
    if (current.parentNode === parentNode)
      parentNode.replaceChild(this._canvas, current);
    else
      throw new Error('ID ' + id + ' already exists in document!');
  } else
    parentNode.appendChild(this._canvas);

  // We might be created before our container has appeared on screen
  this._initialisedBounds = false;

  eventSource.addEventListener(messages.VALVES_UPDATED, this.update.bind(this));
}


RCI.prototype._clear = function(ctx) {
  ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
};


RCI.prototype._drawRect = function(ctx) {
  // The rect is inset by one unit of padding
  var boxLeft = this._padding * this._rectSize;
  // and is the length of a bar plus a unit of padding down
  var boxTop = (this._buckets + this._padding) * this._rectSize;
  // It must accomodate 3 bars, 2 bits of internal padding
  // with padding either side
  var boxWidth = 7 * this._padding * this._rectSize;
  var boxHeight = this._padding * this._rectSize;

  ctx.fillStyle = 'rgb(192, 192, 192)';
  ctx.fillRect(boxLeft, boxTop, boxWidth, boxHeight);
};


RCI.prototype._drawValue = function(ctx, index, value) {
  // Need to scale com and ind
  if (index > 1)
    value = Math.floor(2000/1500 * value);

  var colours = ['rgb(0,255,0)', 'rgb(0, 0, 139)', 'rgb(255, 255, 0)'];
  var barHeightRect = Math.floor(Math.abs(value) / this._scale);
  var barStartY = (value >= 0) ?
    this._buckets + this._padding - barHeightRect : this._buckets + 2 * this._padding;
  var barStartX = 2 * this._padding + (index * 2 * this._padding);

  ctx.fillStyle = colours[index];
  ctx.fillRect(barStartX * this._rectSize, barStartY * this._rectSize,
               this._padding * this._rectSize, barHeightRect * this._rectSize);
};


RCI.prototype._drawLabel = function(ctx, index) {
  var labels = ['R', 'C', 'I'];
  var textLeft = 2 * this._padding + (index * 2 * this._padding) +
                 Math.floor(this._padding/2);

  ctx.font = 'normal xx-small sans-serif';
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.textBaseline = 'bottom';
  ctx.fillText(labels[index], textLeft * this._rectSize,
               (this._buckets + 2 * this._padding) * this._rectSize);
};


RCI.prototype.update = function(data) {
  if (!this._initialised) {
    // The canvas is assumed to fill its container on-screen
    var rect = this._canvas.parentNode.getBoundingClientRect();
    this._canvas.width = rect.width;
    this._canvas.height = rect.height;
    this._canvas.style.margin = '0';
    this._canvas.style.padding = '0';
    this._intialised = true;
  }

  var ctx = this._canvas.getContext('2d');
  this._clear(ctx);
  this._drawRect(ctx);

  var values = [data.residential, data.commercial, data.industrial];
  for (var i = 0; i < 3; i++) {
    this._drawValue(ctx, i, values[i]);
    this._drawLabel(ctx, i);
  }
};


Object.defineProperty(RCI, 'DEFAULT_ID', MiscUtils.makeConstantDescriptor('RCICanvas'));



;// ./src/saveWindow.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */






var SaveWindow = ModalWindow(function() {
  jquery(saveFormID).on('submit', saveWindow_submit.bind(this));
});


var saveFormID = '#saveForm';
var saveOKID = '#saveOK';


var saveWindow_submit = function(e) {
  e.preventDefault();
  this.close();
};


SaveWindow.prototype.close = function() {
  this._toggleDisplay();
  this._emitEvent(messages.SAVE_WINDOW_CLOSED);
};


SaveWindow.prototype.open = function() {
  this._toggleDisplay();
  jquery(saveOKID).focus();
};




;// ./src/screenshotLinkWindow.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */







var ScreenshotLinkWindow = ModalWindow(function() {
  jquery(screenshotLinkFormID).on('submit', screenshotLinkWindow_submit.bind(this));
});


var screenshotLinkFormID = '#screenshotLinkForm';
var screenshotLinkOKID = '#screenshotLinkOK';
var screenshotLinkID = '#screenshotLink';


ScreenshotLinkWindow.prototype.close = function() {
  this._toggleDisplay();
  this._emitEvent(messages.SCREENSHOT_LINK_CLOSED);
};


var screenshotLinkWindow_cancel = function(e) {
  e.preventDefault();
  this.close();
};


var screenshotLinkWindow_submit = function(e) {
  e.preventDefault();
  this.close();
};


ScreenshotLinkWindow.prototype.open = function(screenshotLink) {
  jquery(screenshotLinkID).attr('href', screenshotLink);
  this._toggleDisplay();
};




;// ./src/screenshotWindow.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */







var ScreenshotWindow = ModalWindow(function() {
  jquery(screenshotCancelID).on('click', screenshotWindow_cancel.bind(this));
  jquery(screenshotFormID).on('submit', screenshotWindow_submit.bind(this));
});


var screenshotCancelID = '#screenshotCancel';
var screenshotFormID = '#screenshotForm';
var screenshotOKID = '#screenshotOK';


ScreenshotWindow.prototype.close = function(action) {
  action = action || null;

  this._toggleDisplay();
  this._emitEvent(messages.SCREENSHOT_WINDOW_CLOSED, action);
};


var screenshotWindow_cancel = function(e) {
  e.preventDefault();
  this.close(null);
};


var screenshotWindow_submit = function(e) {
  e.preventDefault();

  var action = null;

  // Get choice
  var screenshotType = jquery('.screenshotType:checked').val();
  if (screenshotType === 'visible')
    action = ScreenshotWindow.SCREENSHOT_VISIBLE;
  else
    action = ScreenshotWindow.SCREENSHOT_ALL;

  this.close(action);
};


ScreenshotWindow.prototype.open = function(screenshotData) {
  this._toggleDisplay();
};


var screenshotWindow_defineAction = (function() {
  var uid = 1;

  return function(name) {
    Object.defineProperty(ScreenshotWindow, name, MiscUtils.makeConstantDescriptor(uid));
    uid += 1;
  };
})();


screenshotWindow_defineAction('SCREENSHOT_VISIBLE');
screenshotWindow_defineAction('SCREENSHOT_ALL');




;// ./src/settingsWindow.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */








var SettingsWindow = ModalWindow(function() {
  jquery(settingsCancelID).on('click', settingsWindow_cancel.bind(this));
  jquery(settingsFormID).on('submit', settingsWindow_submit.bind(this));
});


var settingsCancelID = '#settingsCancel';
var settingsFormID = '#settingsForm';
var settingsOKID = '#settingsOK';
var autoBudgetYesID = '#autoBudgetYes';
var autoBudgetNoID = '#autoBudgetNo';
var autoBulldozeYesID = '#autoBulldozeYes';
var autoBulldozeNoID = '#autoBulldozeNo';
var speedSlowID = '#speedSlow';
var speedMedID = '#speedMed';
var speedFastID = '#speedFast';
var disastersYesID = '#disastersYes';
var disastersNoID = '#disastersNo';


SettingsWindow.prototype.close = function(actions) {
  actions = actions || [];
  this._emitEvent(messages.SETTINGS_WINDOW_CLOSED, actions);
  this._toggleDisplay();
};


var settingsWindow_cancel = function(e) {
  e.preventDefault();
  this.close([]);
};


var settingsWindow_submit = function(e) {
  e.preventDefault();

  var actions = [];

  var shouldAutoBudget = jquery('.autoBudgetSetting:checked').val();
  if (shouldAutoBudget === 'true')
    shouldAutoBudget = true;
  else
    shouldAutoBudget = false;
  actions.push({action: SettingsWindow.AUTOBUDGET, data: shouldAutoBudget});

  var shouldAutoBulldoze = jquery('.autoBulldozeSetting:checked').val();
  if (shouldAutoBulldoze === 'true')
    shouldAutoBulldoze = true;
  else
    shouldAutoBulldoze = false;
  actions.push({action: SettingsWindow.AUTOBULLDOZE, data: shouldAutoBulldoze});

  var speed = jquery('.speedSetting:checked').val() - 0;
  actions.push({action: SettingsWindow.SPEED, data: speed});

  var shouldEnableDisasters = jquery('.enableDisastersSetting:checked').val();
  if (shouldEnableDisasters === 'true')
    shouldEnableDisasters = true;
  else
    shouldEnableDisasters = false;
  actions.push({action: SettingsWindow.DISASTERS_CHANGED, data: shouldEnableDisasters});

  this.close(actions);
};


SettingsWindow.prototype.open = function(settingsData) {
  if (settingsData.autoBudget)
    jquery(autoBudgetYesID).prop('checked', true);
  else
    jquery(autoBudgetNoID).prop('checked', true);

  if (settingsData.autoBulldoze)
    jquery(autoBulldozeYesID).prop('checked', true);
  else
    jquery(autoBulldozeNoID).prop('checked', true);

  if (settingsData.speed === Simulation.SPEED_SLOW)
    jquery(speedSlowID).prop('checked', true);
  else if (settingsData.speed === Simulation.SPEED_MED)
    jquery(speedMedID).prop('checked', true);
  else
    jquery(speedFastID).prop('checked', true);

  if (settingsData.disasters)
    jquery(disastersYesID).prop('checked', true);
  else
    jquery(disastersNoID).prop('checked', true);

  this._toggleDisplay();
};


var settingsWindow_defineAction = (function() {
  var uid = 0;

  return function(name) {
    Object.defineProperty(SettingsWindow, name, MiscUtils.makeConstantDescriptor(uid));
    uid += 1;
  };
})();


settingsWindow_defineAction('AUTOBUDGET');
settingsWindow_defineAction('AUTOBULLDOZE');
settingsWindow_defineAction('SPEED');
settingsWindow_defineAction('DISASTERS_CHANGED');




;// ./src/storage.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */



// A very thin wrapper around localStorage, in case we wish to move to some other storage mechanism
// (such as indexedDB) in the future

var getSavedGame = function() {
  var savedGame = window.localStorage.getItem(this.KEY);

  if (savedGame !== null) {
    savedGame = JSON.parse(savedGame);

    if (savedGame.version !== this.CURRENT_VERSION)
      this.transitionOldSave(savedGame);

    // Flag as a saved game for Game/Simulation etc...
    savedGame.isSavedGame = true;
  }

  return savedGame;
};


var saveGame = function(gameData) {
  gameData.version = this.CURRENT_VERSION;
  gameData = JSON.stringify(gameData);

  window.localStorage.setItem(this.KEY, gameData);
};


var transitionOldSave = function(savedGame) {
  switch (savedGame.version) {
    case 1:
      savedGame.everClicked = false;

      /* falls through */
    case 2:
      savedGame.pollutionMaxX = Math.floor(savedGame.width / 2);
      savedGame.pollutionMaxY = Math.floor(savedGame.height / 2);
      savedGame.cityCentreX = Math.floor(savedGame.width / 2);
      savedGame.cityCentreY = Math.floor(savedGame.height / 2);

      break;

    default:
      throw new Error('Unknown save version!');
  }
};


var Storage = {
  getSavedGame: getSavedGame,
  saveGame: saveGame,
  transitionOldSave: transitionOldSave
};


Object.defineProperty(Storage, 'CURRENT_VERSION', MiscUtils.makeConstantDescriptor(3));
Object.defineProperty(Storage, 'KEY', MiscUtils.makeConstantDescriptor('micropolisJSGame'));
Object.defineProperty(Storage, 'canStore', MiscUtils.makeConstantDescriptor(window.localStorage !== undefined));




;// ./src/touchWarnWindow.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */






var TouchWarnWindow = ModalWindow(function() {
  jquery(touchFormID).on('submit', touchWarnWindow_submit.bind(this));
});


var touchFormID = '#touchForm';
var touchOKID = '#touchOK';


var touchWarnWindow_submit = function(e) {
  e.preventDefault();
  this.close();
};


TouchWarnWindow.prototype.close = function() {
  this._toggleDisplay();
  this._emitEvent(messages.TOUCH_WINDOW_CLOSED);
};


TouchWarnWindow.prototype.open = function() {
  this._toggleDisplay();
  jquery(touchOKID).focus();
};




;// ./src/game.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */






























var disasterTimeout = 20 * 1000;


function Game(gameMap, tileSet, snowTileSet, spriteSheet, difficulty, name) {
  difficulty = difficulty || 0;
  var savedGame;

  if (!gameMap.isSavedGame) {
    this.gameMap = gameMap;
    savedGame = null;
  } else {
    this.gameMap = new GameMap(120, 100);
    savedGame = gameMap;
  }

  this.tileSet = tileSet;
  this.snowTileSet = snowTileSet;
  this.defaultSpeed = Simulation.SPEED_MED;
  this.simulation = new Simulation(this.gameMap, difficulty, this.defaultSpeed, savedGame);

  this.name = name || 'MyTown';
  this.everClicked = false;

  if (savedGame)
    this.load(savedGame);

  this.rci = new RCI('RCIContainer', this.simulation);

  // Note: must init canvas before inputStatus
  this.gameCanvas = new GameCanvas('canvasContainer');
  this.gameCanvas.init(this.gameMap, this.tileSet, spriteSheet);
  this.inputStatus = new InputStatus(this.gameMap, tileSet.tileWidth);

  this.dialogOpen = false;
  this._openWindow = null;
  this.mouse = null;
  this.lastCoord = null;
  this.simNeededBudget = false;
  this.isPaused = false;
  this.lastBadMessageTime = null;

  var self = this;
  if (!this.everClicked) {
    this.nagger = window.setTimeout(function() {
      self.dialogOpen = true;
      self._openWindow = 'nagWindow';
      self.nagWindow.open();
    }, 30 * 60 * 1000);

    jquery('.nag').each(function() {
      jquery(this).click(function(e) {
        if (self.nagger !== null) {
          window.clearTimeout(self.nagger);
        self.nagger = null;
        self.everClicked = true;
      }

      return true;
      });
    });
  }

  // Initialise monsterTV
  this.monsterTV = new MonsterTV(this.gameMap, tileSet, spriteSheet, this.gameCanvas.animationManager);

  var opacityLayerID = 'opaque';

  this.genericDialogClosure = genericDialogClosure.bind(this);

  // Hook up listeners to open/close evaluation window
  this.handleEvalRequest = makeWindowOpenHandler('eval', function() {
    return [this.simulation.evaluation];
  }.bind(this));

  this.evalWindow = new EvaluationWindow(opacityLayerID, 'evalWindow');
  this.evalWindow.addEventListener(messages.EVAL_WINDOW_CLOSED, this.genericDialogClosure);
  this.inputStatus.addEventListener(messages.EVAL_REQUESTED, this.handleEvalRequest.bind(this));

  // ... and similarly for the budget window
  this.handleBudgetRequest = makeWindowOpenHandler('budget', function() {
    var budgetData = {
      roadMaintenanceBudget: this.simulation.budget.roadMaintenanceBudget,
      roadRate: Math.floor(this.simulation.budget.roadPercent * 100),
      fireMaintenanceBudget: this.simulation.budget.fireMaintenanceBudget,
      fireRate: Math.floor(this.simulation.budget.firePercent * 100),
      policeMaintenanceBudget: this.simulation.budget.policeMaintenanceBudget,
      policeRate: Math.floor(this.simulation.budget.policePercent * 100),
      taxRate: this.simulation.budget.cityTax,
      totalFunds: this.simulation.budget.totalFunds,
      taxesCollected: this.simulation.budget.taxFund
    };

    return [budgetData];
  }.bind(this));

  this.budgetWindow = new BudgetWindow(opacityLayerID, 'budget');
  this.budgetWindow.addEventListener(messages.BUDGET_WINDOW_CLOSED, this.handleBudgetWindowClosure.bind(this));
  this.inputStatus.addEventListener(messages.BUDGET_REQUESTED, this.handleBudgetRequest.bind(this));

  // ... and also the disaster window
  this.disasterWindow = new DisasterWindow(opacityLayerID, 'disasterWindow');
  this.disasterWindow.addEventListener(messages.DISASTER_WINDOW_CLOSED, this.handleDisasterWindowClosure.bind(this));
  this.inputStatus.addEventListener(messages.DISASTER_REQUESTED, this.handleDisasterRequest.bind(this));

  // ... the debug window
  this.debugWindow = new DebugWindow(opacityLayerID, 'debugWindow');
  this.debugWindow.addEventListener(messages.DEBUG_WINDOW_CLOSED, this.handleDebugWindowClosure.bind(this));
  this.inputStatus.addEventListener(messages.DEBUG_WINDOW_REQUESTED, this.handleDebugRequest.bind(this));

  // ... the settings window
  this.handleSettingsRequest = makeWindowOpenHandler('settings', function() {
    return [{autoBudget: this.simulation.budget.autoBudget, autoBulldoze: BaseTool.getAutoBulldoze(),
             speed: this.defaultSpeed, disasters: this.simulation.disasterManager.disastersEnabled}];
  }.bind(this));
  this.settingsWindow = new SettingsWindow(opacityLayerID, 'settingsWindow');
  this.settingsWindow.addEventListener(messages.SETTINGS_WINDOW_CLOSED, this.handleSettingsWindowClosure.bind(this));
  this.inputStatus.addEventListener(messages.SETTINGS_WINDOW_REQUESTED, this.handleSettingsRequest.bind(this));

  // ... the screenshot window
  this.screenshotWindow = new ScreenshotWindow(opacityLayerID, 'screenshotWindow');
  this.screenshotWindow.addEventListener(messages.SCREENSHOT_WINDOW_CLOSED, this.handleScreenshotWindowClosure.bind(this));
  this.inputStatus.addEventListener(messages.SCREENSHOT_WINDOW_REQUESTED, this.handleScreenshotRequest.bind(this));

  // ... the screenshot link window
  this.screenshotLinkWindow = new ScreenshotLinkWindow(opacityLayerID, 'screenshotLinkWindow');
  this.screenshotLinkWindow.addEventListener(messages.SCREENSHOT_LINK_CLOSED, this.genericDialogClosure);

  // ... the save confirmation window
  this.saveWindow = new SaveWindow(opacityLayerID, 'saveWindow');
  this.saveWindow.addEventListener(messages.SAVE_WINDOW_CLOSED, this.genericDialogClosure);

  // ... the nag confirmation window
  this.nagWindow = new NagWindow(opacityLayerID, 'nagWindow');
  this.nagWindow.addEventListener(messages.NAG_WINDOW_CLOSED, this.genericDialogClosure);

  // ... the touch warn window
  this.touchWindow = new TouchWarnWindow(opacityLayerID, 'touchWarnWindow');
  this.touchWindow.addEventListener(messages.TOUCH_WINDOW_CLOSED, this.genericDialogClosure);

  // ... and finally the query window
  this.queryWindow = new QueryWindow(opacityLayerID, 'queryWindow');
  this.queryWindow.addEventListener(messages.QUERY_WINDOW_CLOSED, this.genericDialogClosure);
  this.inputStatus.addEventListener(messages.QUERY_WINDOW_NEEDED, this.handleQueryRequest.bind(this));

  // Listen for clicks on the save button
  this.inputStatus.addEventListener(messages.SAVE_REQUESTED, this.handleSave.bind(this));

  // Listen for front end messages
  this.simulation.addEventListener(messages.FRONT_END_MESSAGE, this.processFrontEndMessage.bind(this));

  // Listen for budget messages
  this.simulation.addEventListener(messages.BUDGET_NEEDED, this.handleMandatoryBudget.bind(this));

  // Listen for tool clicks
  this.inputStatus.addEventListener(messages.TOOL_CLICKED, this.handleTool.bind(this));

  // And pauses
  this.inputStatus.addEventListener(messages.SPEED_CHANGE, this.handlePause.bind(this));

  // And date changes
  // XXX Not yet activated
  //this.simulation.addEventListener(Messages.DATE_UPDATED, this.onDateChange.bind(this));

  this.infoBar = InfoBar('cclass', 'population', 'score', 'funds', 'date', 'name');
  var initialValues = {
    classification: this.simulation.evaluation.cityClass,
    population: this.simulation.evaluation.cityPop,
    score: this.simulation.evaluation.cityScore,
    funds: this.simulation.budget.totalFunds,
    date: this.simulation.getDate(),
    name: this.name
  };
  this.infoBar(this.simulation, initialValues);

  this._notificationBar = new Notification('#notifications', this.gameCanvas, Text.messageText[messages.WELCOME]);

  // Track when various milestones are first reached
  this._reachedTown = this._reachedCity = this._reachedCapital = this._reachedMetropolis = this._reacedMegalopolis = false;
  this.congratsWindow = new CongratsWindow(opacityLayerID, 'congratsWindow');
  this.congratsWindow.addEventListener(messages.CONGRATS_WINDOW_CLOSED, this.genericDialogClosure);

  // Listen for touches, so we can warn tablet users
  this.touchListener = touchListener.bind(this);
  window.addEventListener('touchstart', this.touchListener, false);

  // Unhide controls
  this.revealControls();

  // Run the sim
  this.tick = tick.bind(this);
  this.tick();

  // Paint the map
  var debug = Config.debug || Config.gameDebug;
  if (debug) {
    jquery('#debug').toggle();
    this.frameCount = 0;
    this.animStart = new Date();
    this.lastElapsed = -1;
  }

  this.commonAnimate = commonAnimate.bind(this);
  this.animate = (debug ? debugAnimate : this.commonAnimate).bind(this);
  this.animate();
}


Game.prototype.save = function() {
  var saveData = {name: this.name, everClicked: this.everClicked};
  BaseTool.save(saveData);
  this.simulation.save(saveData);

  Storage.saveGame(saveData);
};


Game.prototype.load = function(saveData) {
  this.name = saveData.name;
  this.everClicked = saveData.everClicked;
  BaseTool.load(saveData);
  this.simulation.load(saveData);
};


var nextFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame;


Game.prototype.revealControls = function() {
 jquery('.initialHidden').each(function(e) {
   jquery(this).removeClass('initialHidden');
 });

 this._notificationBar.news({subject: messages.WELCOME});
 this.rci.update({residential: 750, commercial: 750, industrial: 750});
};


var genericDialogClosure = function() {
  this.dialogOpen = false;
  this._openWindow = null;
};


Game.prototype.onDateChange = function(date) {
  if (date.month === 10 && random.Random.getChance(10))
    this.gameCanvas.changeTileSet(this.snowTileSet);
  else if (date.month === 1)
    this.gameCanvas.changeTileSet(this.tileSet);
};


Game.prototype.handleDisasterWindowClosure = function(request) {
  this.dialogOpen = false;

  if (request === DisasterWindow.DISASTER_NONE)
    return;

  switch (request) {
    case DisasterWindow.DISASTER_MONSTER:
      this.simulation.spriteManager.makeMonster();
      break;

    case DisasterWindow.DISASTER_FIRE:
      this.simulation.disasterManager.makeFire();
      break;

    case DisasterWindow.DISASTER_FLOOD:
      this.simulation.disasterManager.makeFlood();
      break;

    case DisasterWindow.DISASTER_CRASH:
      this.simulation.disasterManager.makeCrash();
      break;

    case DisasterWindow.DISASTER_MELTDOWN:
      this.simulation.disasterManager.makeMeltdown();
      break;

    case DisasterWindow.DISASTER_TORNADO:
      this.simulation.spriteManager.makeTornado();
  }
};


Game.prototype.handleSettingsWindowClosure = function(actions) {
  this.dialogOpen = false;

  for (var i = 0, l = actions.length; i < l; i++) {
    var a = actions[i];

    switch (a.action) {
      case SettingsWindow.AUTOBUDGET:
        this.simulation.budget.setAutoBudget(a.data);
        break;

      case SettingsWindow.AUTOBULLDOZE:
        BaseTool.setAutoBulldoze(a.data);
        break;

      case SettingsWindow.SPEED:
        this.defaultSpeed = a.data;
        this.simulation.setSpeed(this.defaultSpeed);
        break;

      case SettingsWindow.DISASTERS_CHANGED:
        this.simulation.disasterManager.disastersEnabled = a.data;
        break;

      default:
        console.warn('Unexpected action', a);
    }
  }
};


Game.prototype.handleDebugWindowClosure = function(actions) {
  this.dialogOpen = false;

  for (var i = 0, l = actions.length; i < l; i++) {
    var a = actions[i];

    switch (a.action) {
      case DebugWindow.ADD_FUNDS:
        this.simulation.budget.spend(-20000);
        break;

      default:
        console.warn('Unexpected action', a);
    }
  }
};


Game.prototype.handleScreenshotWindowClosure = function(action) {
  this.dialogOpen = false;

  if (action === null)
    return;

  var dataURI;
  if (action === ScreenshotWindow.SCREENSHOT_VISIBLE)
    dataURI = this.gameCanvas.screenshotVisible();
  else if (action === ScreenshotWindow.SCREENSHOT_ALL)
    dataURI = this.gameCanvas.screenshotMap();

  this.dialogOpen = true;
  this._openWindow = 'screenshotLinkWindow';
  this.screenshotLinkWindow.open(dataURI);
};


Game.prototype.handleBudgetWindowClosure = function(data) {
  this.dialogOpen = false;

  if (!data.cancelled) {
    this.simulation.budget.roadPercent = data.roadPercent / 100;
    this.simulation.budget.firePercent = data.firePercent / 100;
    this.simulation.budget.policePercent = data.policePercent / 100;
    this.simulation.budget.setTax(data.taxPercent - 0);
    if (this.simNeededBudget) {
      this.simulation.budget.doBudgetWindow();
      this.simNeededBudget = false;
    } else {
      this.simulation.budget.updateFundEffects();
    }
  }
};


var makeWindowOpenHandler = function(winName, customFn) {
  customFn = customFn || null;

  return function() {
    if (this.dialogOpen) {
      console.warn('Request made to open ' + winName + ' window. There is a dialog open!');
      return;
    }

    this.dialogOpen = true;
    this._openWindow = winName + 'Window';
    var win = winName + 'Window';
    var data = [];

    if (customFn)
      data = customFn();

    this[win].open.apply(this[win], data);
  };
};


Game.prototype.handleDebugRequest = makeWindowOpenHandler('debug');
Game.prototype.handleDisasterRequest = makeWindowOpenHandler('disaster');
Game.prototype.handleQueryRequest = makeWindowOpenHandler('query');
Game.prototype.handleScreenshotRequest = makeWindowOpenHandler('screenshot');


Game.prototype.handleMandatoryBudget = function() {
  this.simNeededBudget = true;
  this.handleBudgetRequest();
};


Game.prototype.handleTool = function(data) {
  var x = data.x;
  var y = data.y;

  // Were was the tool clicked?
  var tileCoords = this.gameCanvas.canvasCoordinateToTileCoordinate(x, y);

  if (tileCoords === null)
    return;

  var tool = this.inputStatus.currentTool;

  var budget = this.simulation.budget;
  var evaluation = this.simulation.evaluation;

  // do it!
  tool.doTool(tileCoords.x, tileCoords.y, this.simulation.blockMaps);

  tool.modifyIfEnoughFunding(budget);
  switch (tool.result) {
    case tool.TOOLRESULT_NEEDS_BULLDOZE:
      jquery('#toolOutput').text(Text.toolMessages.needsDoze);
      break;

    case tool.TOOLRESULT_NO_MONEY:
      jquery('#toolOutput').text(Text.toolMessages.noMoney);
      break;

    default:
      jquery('#toolOutput').html('Tools');
  }
};


Game.prototype.handleSave = function() {
  this.save();
  this.dialogOpen = true;
  this._openWindow = 'saveWindow';
  this.saveWindow.open();
};


Game.prototype.handlePause = function() {
  // XXX Currently only offer pause and run to the user
  // No real difference among the speeds until we optimise
  // the sim
  this.isPaused = !this.isPaused;

  if (this.isPaused)
    this.simulation.setSpeed(Simulation.SPEED_PAUSED);
  else
    this.simulation.setSpeed(this.defaultSpeed);
};


Game.prototype.handleInput = function() {
  if (!this.dialogOpen) {
    // Handle keyboard movement

    if (this.inputStatus.left)
      this.gameCanvas.moveWest();
    else if (this.inputStatus.up)
      this.gameCanvas.moveNorth();
    else if (this.inputStatus.right)
      this.gameCanvas.moveEast();
    else if (this.inputStatus.down)
      this.gameCanvas.moveSouth();
  }

  if (this.inputStatus.escape) {
    // We need to handle escape, as InputStatus won't know what dialogs are showing
    if (this.dialogOpen) {
      this.dialogOpen = false;
      this[this._openWindow].close();
      this._openWindow = null;
    } else
      this.inputStatus.clearTool();
  }
};


// Will be bound on construction
var touchListener = function(e) {
  window.removeEventListener('touchstart', this.touchListener, false);
  this._openWindow = 'touchWindow';
  this.dialogOpen = true;
  this.touchWindow.open();
};


Game.prototype.processFrontEndMessage = function(message) {
  var subject = message.subject;
  var d = new Date();

  if (Text.goodMessages[subject] !== undefined) {
    var cMessage = this.name + ' is now a ';

    switch (subject) {
      case messages.REACHED_CAPITAL:
        if (!this._reachedCapital) {
          this._reachedCapital = true;
          cMessage += 'capital!';
        }
        break;

      case messages.REACHED_CITY:
        if (!this._reachedCity) {
          this._reachedCity = true;
          cMessage += 'city!';
        }
        break;

      case messages.REACHED_MEGALOPOLIS:
        if (!this._reachedMegalopolis) {
          this._reachedMegalopolis = true;
          cMessage += 'megalopolis!';
        }
        break;

      case messages.REACHED_METROPOLIS:
        if (!this._reachedMetropolis) {
          this._reachedMetropolis = true;
          cMessage += 'metropolis!';
        }
        break;

      case messages.REACHED_TOWN:
        if (!this._reachedTown) {
          this._reachedTown = true;
          cMessage += 'town!';
        }
        break;
    }

    if (this.lastBadMessageTime === null || d - this.lastBadMessageTime > disasterTimeout) {
      this.lastBadMessageTime = null;
      this._notificationBar.goodNews(message);
    }

    if (cMessage !== (this.name + ' is now a ')) {
      this.dialogOpen = true;
      this._openWindow = 'congratsWindow';
      this.congratsWindow.open(cMessage);
    }

    return;
  }

  // Show disaster if applicable
  if (message.data) {
    if (message.data.showable)
    this.monsterTV.show(message.data.x, message.data.y);
    else if (message.data.trackable)
    this.monsterTV.track(message.data.x, message.data.y, message.data.sprite);
  }

  if (Text.badMessages[subject] !== undefined) {
    this._notificationBar.badNews(message);
    if (messages.DISASTER_MESSAGES.indexOf(message.subject) !== -1)
      this.lastBadMessageTime = d;
    return;
  }

  if (Text.neutralMessages[subject] !== undefined) {
    if (this.lastBadMessageTime === null || d - this.lastBadMessageTime > disasterTimeout) {
      this.lastBadMessageTime = null;
      this._notificationBar.news(message);
    }
    return;
  }

  console.warn('Unexpected message: ', subject);
};


Game.prototype.calculateMouseForPaint = function() {
  // Determine whether we need to draw a tool outline in the
  // canvas
  var mouse = null;

  if (this.inputStatus.mouseX !== -1 && this.inputStatus.toolWidth > 0) {
    var tileCoords = this.gameCanvas.canvasCoordinateToTileOffset(this.inputStatus.mouseX, this.inputStatus.mouseY);
    if (tileCoords !== null) {
      mouse = {};

      mouse.x = tileCoords.x;
      mouse.y = tileCoords.y;

      // The inputStatus fields came from DOM attributes, so will be strings.
      // Coerce back to numbers.
      mouse.width = this.inputStatus.toolWidth - 0;
      mouse.height = this.inputStatus.toolWidth - 0;
      mouse.colour = this.inputStatus.toolColour || 'yellow';
    }
  }

  return mouse;
};


Game.prototype.calculateSpritesForPaint = function(canvas) {
  var origin = canvas.getTileOrigin();
  var spriteList = this.simulation.spriteManager.getSpritesInView(origin.x, origin.y, canvas.canvasWidth, canvas.canvasHeight);

  if (spriteList.length === 0)
    return null;

  return spriteList;
};


var tick = function() {
  this.handleInput();

  if (this.dialogOpen) {
    window.setTimeout(this.tick, 0);
    return;
  }

  if (!this.simulation.isPaused() && !jquery('#tooSmall').is(':visible')) {
    // Run the sim
    this.simulation.simTick();
  }

  // Run this even when paused: you can still build when paused
  this.mouse = this.calculateMouseForPaint();

  window.setTimeout(this.tick, 0);
};


var commonAnimate = function() {
  if (this.dialogShowing) {
    nextFrame(this.animate);
    return;
  }

  if (!this.isPaused)
    this.simulation.spriteManager.moveObjects(this.simulation._constructSimData());

  var sprites = this.calculateSpritesForPaint(this.gameCanvas);
  this.gameCanvas.paint(this.mouse, sprites, this.isPaused);

  sprites = this.calculateSpritesForPaint(this.monsterTV.canvas);
  this.monsterTV.paint(sprites, this.isPaused);

  nextFrame(this.animate);
};


var debugAnimate = function() {
  var date = new Date();
  var elapsed = Math.floor((date - this.animStart) / 1000);

  if (elapsed > this.lastElapsed && this.frameCount > 0) {
    jquery('#fpsValue').text(Math.floor(this.frameCount/elapsed));
    this.lastElapsed = elapsed;
  }

  this.frameCount++;
  this.commonAnimate();
};




;// ./src/mapGenerator.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */








var TERRAIN_CREATE_ISLAND;
var TERRAIN_TREE_LEVEL = -1;
var TERRAIN_LAKE_LEVEL = -1;
var TERRAIN_CURVE_LEVEL = -1;
var ISLAND_RADIUS = 18;

var MapGenerator = function(w, h) {
  w = w || 120;
  h = h || 100;

  TERRAIN_CREATE_ISLAND = random.Random.getRandom(2) - 1;

  var map = new GameMap(w, h);
  // Construct land.
  if (TERRAIN_CREATE_ISLAND < 0) {
    if (random.Random.getRandom(100) < 10) {
      makeIsland(map);
      return map;
    }
  }

  if (TERRAIN_CREATE_ISLAND === 1)
    makeNakedIsland(map);
  else
    clearMap(map);

  // Lay a river.
  if (TERRAIN_CURVE_LEVEL !== 0) {
    var terrainXStart = 40 + random.Random.getRandom(map.width - 80);
    var terrainYStart = 33 + random.Random.getRandom(map.height - 67);

    var terrainPos = new position.Position(terrainXStart, terrainYStart);
    doRivers(map, terrainPos);
  }

  // Lay a few lakes.
  if (TERRAIN_LAKE_LEVEL !== 0)
      makeLakes(map);

  smoothRiver(map);

  // And add trees.
  if (TERRAIN_TREE_LEVEL !== 0)
      doTrees(map);

  return map;
};


var clearMap = function(map) {
  for (var x = 0; x < map.width; x++) {
    for (var y = 0; y < map.height; y++) {
      map.setTile(x, y, src_tileValues.DIRT, 0);
    }
  }
};


var clearUnnatural = function(map) {
  for (var x = 0; x < map.width; x++) {
    for (var y = 0; y < map.height; y++) {
      var tileValue = map.getTileValue(x, y);
      if (tileValue > WOODS)
        map.setTile(x, y, DIRT, 0);
    }
  }
};


var makeNakedIsland = function(map) {
  var terrainIslandRadius = ISLAND_RADIUS;
  var x, y;

  for (x = 0; x < map.width; x++) {
    for (y = 0; y < map.height; y++) {
      if ((x < 5) || (x >= map.width - 5) ||
          (y < 5) || (y >= map.height - 5)) {
        map.setTile(x, y, src_tileValues.RIVER, 0);
      } else {
        map.setTile(x, y, src_tileValues.DIRT, 0);
      }
    }
  }

  for (x = 0; x < map.width - 5; x += 2) {
    var mapY = random.Random.getERandom(terrainIslandRadius);
    plopBRiver(map, new position.Position(x, mapY));

    mapY = (map.height - 10) - random.Random.getERandom(terrainIslandRadius);
    plopBRiver(map, new position.Position(x, mapY));

    plopSRiver(map, new position.Position(x, 0));
    plopSRiver(map, new position.Position(x, map.height - 6));
  }

  for (y = 0; y < map.height - 5; y += 2) {
    var mapX = random.Random.getERandom(terrainIslandRadius);
    plopBRiver(map, new position.Position(mapX, y));

    mapX = map.width - 10 - random.Random.getERandom(terrainIslandRadius);
    plopBRiver(map, new position.Position(mapX, y));

    plopSRiver(map, new position.Position(0, y));
    plopSRiver(map, new position.Position(map.width - 6, y));
  }
};


var makeIsland = function(map) {
  makeNakedIsland(map);
  smoothRiver(map);
  doTrees(map);
};


var makeLakes = function(map) {
  var numLakes;
  if (TERRAIN_LAKE_LEVEL < 0)
      numLakes = random.Random.getRandom(10);
  else
      numLakes = TERRAIN_LAKE_LEVEL / 2;

  while (numLakes > 0) {
    var x = random.Random.getRandom(map.width - 21) + 10;
    var y = random.Random.getRandom(map.height - 20) + 10;

    makeSingleLake(map, new position.Position(x, y));
    numLakes--;
  }
};


var makeSingleLake = function(map, pos) {
  var numPlops = random.Random.getRandom(12) + 2;

  while (numPlops > 0) {
    var plopPos = new position.Position(pos, random.Random.getRandom(12) - 6, random.Random.getRandom(12) - 6);

    if (random.Random.getRandom(4))
        plopSRiver(map, plopPos);
    else
        plopBRiver(map, plopPos);

    numPlops--;
  }
};


var treeSplash = function(map, x, y) {
  var numTrees;

  if (TERRAIN_TREE_LEVEL < 0)
    numTrees = random.Random.getRandom(150) + 50;
  else
    numTrees = random.Random.getRandom(100 + (TERRAIN_TREE_LEVEL * 2)) + 50;

  var treePos = new position.Position(x, y);

  while (numTrees > 0) {
    var dir = (0,direction.getRandomDirection)();
    treePos = position.Position.move(treePos, dir);

    if (!map.isPositionInBounds(treePos))
      return;

    if (map.getTileValue(treePos) === src_tileValues.DIRT)
      map.setTile(treePos, src_tileValues.WOODS, src_tileFlags.BLBNBIT);

    numTrees--;
  }
};


var doTrees = function(map) {
  var amount;

  if (TERRAIN_TREE_LEVEL < 0)
    amount = random.Random.getRandom(100) + 50;
  else
    amount = TERRAIN_TREE_LEVEL + 3;

  for (var x = 0; x < amount; x++) {
      var xloc = random.Random.getRandom(map.width - 1);
      var yloc = random.Random.getRandom(map.height - 1);
      treeSplash(map, xloc, yloc);
  }

  smoothTrees(map);
  smoothTrees(map);
};


var riverEdges = [
  13 | src_tileFlags.BULLBIT, 13 | src_tileFlags.BULLBIT, 17 | src_tileFlags.BULLBIT, 15 | src_tileFlags.BULLBIT,
   5 | src_tileFlags.BULLBIT,        src_tileValues.RIVER, 19 | src_tileFlags.BULLBIT, 17 | src_tileFlags.BULLBIT,
   9 | src_tileFlags.BULLBIT, 11 | src_tileFlags.BULLBIT,        src_tileValues.RIVER, 13 | src_tileFlags.BULLBIT,
   7 | src_tileFlags.BULLBIT,  9 | src_tileFlags.BULLBIT,  5 | src_tileFlags.BULLBIT,        src_tileValues.RIVER];

var smoothRiver = function(map) {
  var dx = [-1,  0,  1,  0];
  var dy = [0,  1,  0, -1];

  for (var x = 0; x < map.width; x++) {
    for (var y = 0; y < map.height; y++) {
      if (map.getTileValue(x, y) === src_tileValues.REDGE) {
        var bitIndex = 0;

        for (var z = 0; z < 4; z++) {
          bitIndex = bitIndex << 1;
          var xTemp = x + dx[z];
          var yTemp = y + dy[z];
          if (map.testBounds(xTemp, yTemp) &&
              map.getTileValue(xTemp, yTemp) !== src_tileValues.DIRT &&
              (map.getTileValue(xTemp, yTemp) < src_tileValues.WOODS_LOW ||
               map.getTileValue(xTemp, yTemp) > src_tileValues.WOODS_HIGH)) {
            bitIndex++;
          }
        }

        var temp = riverEdges[bitIndex & 15];
        if (temp !== src_tileValues.RIVER && random.Random.getRandom(1))
          temp++;

        map.setTileValue(x, y, temp, 0);
      }
    }
  }
};


var isTree = function(tileValue) {
  return tileValue >= src_tileValues.WOODS_LOW && tileValue <= src_tileValues.WOODS_HIGH;
};


var smoothTrees = function(map) {
  for (var x = 0; x < map.width; x++) {
    for (var y = 0; y < map.height; y++) {
      if (isTree(map.getTileValue(x, y)))
        smoothTreesAt(map, x, y, false);
    }
  }
};


var treeTable = [
   0,   0,  0, 34,
   0,   0, 36, 35,
   0,  32,  0, 33,
  30,  31, 29, 37];

var smoothTreesAt = function(map, x, y, preserve) {
  var dx = [-1,  0,  1,  0 ];
  var dy = [ 0,  1,  0, -1 ];
  if (!isTree(map.getTileValue(x, y)))
      return;

  var bitIndex = 0;
  for (var i = 0; i < 4; i++) {
    bitIndex = bitIndex << 1;
    var xTemp = x + dx[i];
    var yTemp = y + dy[i];
    if (map.testBounds(xTemp, yTemp) &&
        isTree(map.getTileValue(xTemp, yTemp)))
      bitIndex++;
  }

  var temp = treeTable[bitIndex & 15];
  if (temp) {
    if (temp !== src_tileValues.WOODS) {
      if ((x + y) & 1)
          temp = temp - 8;
    }
    map.setTile(x, y, temp, src_tileFlags.BLBNBIT);
  } else {
    if (!preserve)
      map.setTileValue(x, y, temp, 0);
  }
};



var doRivers = function(map, terrainPos) {
  var riverDir = (0,direction.getRandomCardinalDirection)();
  doBRiver(map, terrainPos, riverDir, riverDir);

  riverDir = riverDir.oppositeDirection();
  var terrainDir = doBRiver(map, terrainPos, riverDir, riverDir);

  riverDir = (0,direction.getRandomCardinalDirection)();
  doSRiver(map, terrainPos, riverDir, terrainDir);
};


var doBRiver = function(map, pos, riverDir, terrainDir) {
  var rate1, rate2;

  if (TERRAIN_CURVE_LEVEL < 0) {
    rate1 = 100;
    rate2 = 200;
  } else {
    rate1 = TERRAIN_CURVE_LEVEL + 10;
    rate2 = TERRAIN_CURVE_LEVEL + 100;
  }

  while (map.testBounds(pos.x + 4, pos.y + 4)) {
    plopBRiver(map, pos);
    if (random.Random.getRandom(rate1) < 10) {
      terrainDir = riverDir;
    } else {
      if (random.Random.getRandom(rate2) > 90)
        terrainDir = terrainDir.rotateClockwise();
      if (random.Random.getRandom(rate2) > 90)
        terrainDir = terrainDir.rotateCounterClockwise();
    }
    pos = position.Position.move(pos, terrainDir);
  }

  return terrainDir;
};


var doSRiver = function(map, pos, riverDir, terrainDir) {
  var rate1, rate2;

  if (TERRAIN_CURVE_LEVEL < 0) {
    rate1 = 100;
    rate2 = 200;
  } else {
    rate1 = TERRAIN_CURVE_LEVEL + 10;
    rate2 = TERRAIN_CURVE_LEVEL + 100;
  }

  while (map.testBounds(pos.x + 3, pos.y + 3)) {
    plopSRiver(map, pos);
    if (random.Random.getRandom(rate1) < 10) {
      terrainDir = riverDir;
    } else {
      if (random.Random.getRandom(rate2) > 90)
        terrainDir = terrainDir.rotateClockwise();
      if (random.Random.getRandom(rate2) > 90)
        terrainDir = terrainDir.rotateCounterClockwise();
    }
    pos = position.Position.move(pos, terrainDir);
  }

  return terrainDir;
};


var putOnMap = function(map, newVal, x, y) {
  if (newVal === 0)
    return;

  if (!map.testBounds(x, y))
    return;

  var tileValue = map.getTileValue(x, y);

  if (tileValue !== src_tileValues.DIRT) {
    if (tileValue === src_tileValues.RIVER) {
      if (newVal !== src_tileValues.CHANNEL)
          return;
    }
    if (tileValue === src_tileValues.CHANNEL)
      return;
  }
  map.setTile(x, y, newVal, 0);
};


var plopBRiver = function(map, pos) {
  var BRMatrix = [
   [    0,     0,     0, src_tileValues.REDGE,  src_tileValues.REDGE,  src_tileValues.REDGE,     0,     0,     0],
   [    0,     0, src_tileValues.REDGE, src_tileValues.RIVER,  src_tileValues.RIVER,  src_tileValues.RIVER, src_tileValues.REDGE,     0,     0],
   [    0, src_tileValues.REDGE, src_tileValues.RIVER, src_tileValues.RIVER,  src_tileValues.RIVER,  src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.REDGE,     0],
   [src_tileValues.REDGE, src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.RIVER,  src_tileValues.RIVER,  src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.REDGE],
   [src_tileValues.REDGE, src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.CHANNEL, src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.REDGE],
   [src_tileValues.REDGE, src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.RIVER,  src_tileValues.RIVER,  src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.REDGE],
   [    0, src_tileValues.REDGE, src_tileValues.RIVER, src_tileValues.RIVER,  src_tileValues.RIVER,  src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.REDGE,     0],
   [    0,     0, src_tileValues.REDGE, src_tileValues.RIVER,  src_tileValues.RIVER,  src_tileValues.RIVER, src_tileValues.REDGE,     0,     0],
   [    0,     0,     0, src_tileValues.REDGE,  src_tileValues.REDGE,  src_tileValues.REDGE,     0,     0,     0]];

  for (var x = 0; x < 9; x++) {
    for (var y = 0; y < 9; y++) {
      putOnMap(map, BRMatrix[y][x], pos.x + x, pos.y + y);
    }
  }
};


var plopSRiver = function(map, pos) {
  var SRMatrix = [
    [    0,     0, src_tileValues.REDGE, src_tileValues.REDGE,     0,     0],
    [    0, src_tileValues.REDGE, src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.REDGE,     0],
    [src_tileValues.REDGE, src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.REDGE],
    [src_tileValues.REDGE, src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.REDGE],
    [    0, src_tileValues.REDGE, src_tileValues.RIVER, src_tileValues.RIVER, src_tileValues.REDGE,     0],
    [    0,     0, src_tileValues.REDGE, src_tileValues.REDGE,     0,     0]];


  for (var x = 0; x < 6; x++) {
    for (var y = 0; y < 6; y++) {
      putOnMap(map, SRMatrix[y][x], pos.x + x, pos.y + y);
    }
  }
};


var smoothWater = function(map) {
  var x, y, tile, pos, dir;

  for (x = 0; x < map.width; x++) {
    for (y = 0; y < map.height; y++) {
      tile = map.getTileValue(x, y);

      if (tile >= WATER_LOW && tile <= WATER_HIGH) {
        pos = new Position(x, y);
        let stop = false;

        forEachCardinalDirection(dir => {
          if (stop) {
            return;
          }

          tile = map.getTileFromMap(pos, dir, WATER_LOW);

          /* If nearest object is not water: */
          if (tile < WATER_LOW || tile > WATER_HIGH) {
            map.setTileValue(x, y, REDGE, 0); /* set river edge */
            stop = true; // Continue with next tile
          }
        });
      }
    }
  }

  for (x = 0; x < map.width; x++) {
    for (y = 0; y < map.height; y++) {
      tile = map.getTileValue(x, y);

      if (tile !== CHANNEL && tile >= WATER_LOW && tile <= WATER_HIGH) {
        var makeRiver = true;

        pos = new Position(x, y);

        forEachCardinalDirection(dir => {
          if (!makeRiver) {
            return;
          }

          tile = map.getTileFromMapOrDefault(pos, dir, WATER_LOW);

          if (tile < WATER_LOW || tile > WATER_HIGH) {
            makeRiver = false;
          }
        });

        if (makeRiver)
          map.setTileValue(x, y, RIVER, 0);
      }
    }
  }

  for (x = 0; x < map.width; x++) {
    for (y = 0; y < map.height; y++) {
      tile = map.getTileValue(x, y);

      if (tile >= WOODS_LOW && tile <= WOODS_HIGH) {
        pos = new Position(x, y);
        let stop = false;

        forEachCardinalDirection(dir => {
          if (stop) {
            return;
          }

          tile = map.getTileFromMapOrDefault(pos, dir, TILE_INVALID);

          if (tile === RIVER || tile === CHANNEL) {
            map.setTileValue(x, y, REDGE, 0); /* make it water's edge */
            stop = true;
          }
        });
      }
    }
  }
};




;// ./src/splashCanvas.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */





/*
 *
 * The SplashCanvas handles painting a canvas with the minimap that is shown to the player when selecting a map to
 * play on (in fact it also handles the creation of said canvas). It is a far lighter cousin of GameCanvas, as the
 * map only needs to be painted once (although new maps may be painted if the player generates a new map). We let
 * the canvas handle the scaling of the tiles.
 *
 */


// Takes the DOM id of the container in which the new canvas should be placed, and the tileset that should be used
// for painting. Additionally, this function can also take an optional ID for the new canvas; SplashScreen.DEFAULT_ID
// will be used if this isn't supplied.
//
// Handles canvas creation, throwing an error if the canvas' ID exists anywhere other than the specified parent node,
// or if the given parent node is absent, or if the tileset isn't valid. This function does not paint the canvas: you
// must explicitly call paint with a map.
function SplashCanvas(parentID, tileSet, id) {
  id = id || SplashCanvas.DEFAULT_ID;

  if (!(this instanceof SplashCanvas))
    return new SplashCanvas(parentNode, tileSet, id);

  if (parentID === undefined)
    throw new Error('No container specified');
  else if (tileSet === undefined)
    throw new Error('No tileset specified');
  else if (!tileSet.isValid)
    throw new Error('Tileset is not valid!');

  this._tileSet = tileSet;

  // Check the parent container exists
  var parentNode = jquery(MiscUtils.normaliseDOMid(parentID));
  parentNode = parentNode.length === 0 ? null : parentNode[0];
  if (parentNode === null)
    throw new Error('SplashCanvas container ID ' + parentID + ' not found');

  var height = SplashCanvas.DEFAULT_HEIGHT;
  var width = SplashCanvas.DEFAULT_WIDTH;

  // Create the canvas
  this._canvas = document.createElement('canvas');
  this._canvas.id = id;
  this._canvas.width = width;
  this._canvas.height = height;

  // Remove any existing element with the same id
  var existing = document.getElementById(id);
  if (existing !== null) {
    if (existing.parentNode === parentNode) {
      console.warn('There was already an object with the same ID as SplashCanvas - replacing it!');
      parentNode.replaceChild(this._canvas, existing);
    } else {
      console.warn('SplashCanvas id ' + id + ' already exists somewhere in document');
      throw new Error('ID ' + id + ' already exists in document!');
    }
  } else {
    parentNode.appendChild(this._canvas);
  }
}


// Paint an individual tile at the given map coordinates, with the tile scaled down to 3x3
SplashCanvas.prototype._paintTile = function(tileVal, x, y, ctx) {
  var src = this._tileSet[tileVal];
  ctx.drawImage(src, x * 3, y * 3, 3, 3);
};


// Loop through the given map, painting each tile scaled down
SplashCanvas.prototype.paint = function(map) {
  var ctx = this._canvas.getContext('2d');
  ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

  for (var y = 0; y < map.height; y++) {
    for (var x = 0; x < map.width; x++) {
      this._paintTile(map.getTileValue(x, y), x, y, ctx);
    }
  }
};


SplashCanvas.DEFAULT_WIDTH = 360;
SplashCanvas.DEFAULT_HEIGHT = 300;
SplashCanvas.DEFAULT_ID = 'SplashCanvas';




;// ./src/splashScreen.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */










/*
 *
 * The SplashScreen is the first screen the player will see on launch. It is responsible for map generation,
 * placing UI on screen to allow the player to select a map or load a game, and finally launching the game.
 * This should not be called until the tiles and sprites have been loaded.
 *
 */

var onresize = null;


// If the window is initially too small, try and relaunch if it gets bigger
var makeResizeListener = function(tileSet, spriteSheet) {
  return function(tileSet, spriteSheet, e) {
    jquery(window).off('resize');
    var s = new SplashScreen(tileSet, spriteSheet);
  }.bind(null, tileSet, spriteSheet);
};


function SplashScreen(tileSet, snowTileSet, spriteSheet) {
  // We don't launch the game if the screen is too small, however, we should retain the right to do so
  // should the situation change...
  if (jquery('#tooSmall').is(':visible')) {
    onresize = makeResizeListener(tileSet, spriteSheet);
    jquery(window).on('resize', onresize);
    return;
  }

  this.tileSet = tileSet;
  this.snowTileSet = snowTileSet;
  this.spriteSheet = spriteSheet;
  this.map = MapGenerator();

  // Set up listeners on buttons. When play is clicked, we will move on to get the player's desired
  // difficulty level and city name before launching the game properly
  jquery('#splashGenerate').click(regenerateMap.bind(this));
  jquery('#splashPlay').click(acquireNameAndDifficulty.bind(this));
  jquery('#splashLoad').click(handleLoad.bind(this));

  // Conditionally enable load/save buttons
  jquery('#saveRequest').prop('disabled', !Storage.canStore);
  jquery('#splashLoad').prop('disabled', !(Storage.canStore && Storage.getSavedGame() !== null));

  // Paint the minimap
  this.splashCanvas = new SplashCanvas('splashContainer', tileSet);
  this.splashCanvas.paint(this.map);

  // Let's get some bits on screen!
  jquery('.awaitGeneration').toggle();
  jquery('#splashPlay').focus();
}


// Generate a new map at the user's request, and paint it
var regenerateMap = function(e) {
  e.preventDefault();

  this.map = MapGenerator();
  this.splashCanvas.paint(this.map);
};


// Fetches game data from the storage manager, and launches the game. We won't return from here
var handleLoad = function(e) {
  e.preventDefault();

  var savedGame = Storage.getSavedGame();

  if (savedGame === null)
    return;

  // Remove installed event listeners
  jquery('#splashLoad').off('click');
  jquery('#splashGenerate').off('click');
  jquery('#splashPlay').off('click');

  // Hide the splashscreen UI
  jquery('#splash').toggle();

  // Launch
  var g = new Game(savedGame, this.tileSet, this.snowTileSet, this.spriteSheet, Simulation.LEVEL_EASY, name);
};


// After a map has been selected, call this function to display a form asking the user for
// a city name and difficulty level.
var acquireNameAndDifficulty = function(e) {
  e.preventDefault();

  // Remove the initial event listeners
  jquery('#splashLoad').off('click');
  jquery('#splashGenerate').off('click');
  jquery('#splashPlay').off('click');

  // Get rid of the initial splash screen
  jquery('#splash').toggle();

  // As a convenience, the city name is not mandatory in debug mode
  if (Config.debug)
    jquery('#nameForm').removeAttr('required');

  // When the form is submitted, we'll be ready to launch the game
  jquery('#playForm').submit(play.bind(this));

  // Display the name and difficulty form
  jquery('#start').toggle();
  jquery('#nameForm').focus();
};


// This function should be called after the name/difficulty form has been submitted. The game will now be launched
// with the map selected earlier.
var play = function(e) {
  e.preventDefault();

  // As usual, uninstall event listeners, and hide the UI
  jquery('#playForm').off('submit');
  jquery('#start').toggle();

  // What values did the player specify?
  var difficulty = jquery('.difficulty:checked').val() - 0;
  var name = jquery('#nameForm').val();

  // Launch a new game
  var g = new Game(this.map, this.tileSet, this.snowTileSet, this.spriteSheet, difficulty, name);
};




// EXTERNAL MODULE: ./src/tileSetURI.ts
var tileSetURI = __webpack_require__(952);
// EXTERNAL MODULE: ./src/tileSetSnowURI.ts
var tileSetSnowURI = __webpack_require__(353);
;// ./src/micropolis.js
/* micropolisJS. Adapted by Graeme McCutcheon from Micropolis.
 *
 * This code is released under the GNU GPL v3, with some additional terms.
 * Please see the files LICENSE and COPYING for details. Alternatively,
 * consult http://micropolisjs.graememcc.co.uk/LICENSE and
 * http://micropolisjs.graememcc.co.uk/COPYING
 *
 * The name/term "MICROPOLIS" is a registered trademark of Micropolis (https://www.micropolis.com) GmbH
 * (Micropolis Corporation, the "licensor") and is licensed here to the authors/publishers of the "Micropolis"
 * city simulation game and its source code (the project or "licensee(s)") as a courtesy of the owner.
 *
 */









/*
 *
 * Our task in main is to load the tile image, create a TileSet from it, and then tell the SplashScreen to display
 * itself. We will never return here.
 *
 */


var fallbackImage, tileSet, snowTileSet;


var onTilesLoaded = function() {
  var snowTiles = jquery('#snowtiles')[1];
  snowTileSet = new TileSet(snowTiles, onAllTilesLoaded, onFallbackTilesLoaded);
};


var onAllTilesLoaded = function() {
  // Kick things off properly
  var sprites = jquery('#sprites')[0];
  if (sprites.complete) {
    jquery('#loadingBanner').css('display', 'none');
    var s = new SplashScreen(tileSet, snowTileSet, sprites);
  } else {
     window.setTimeout(onAllTilesLoaded, 0);
  }
};


// XXX Replace with an error dialog
var onFallbackError = function() {
  fallbackImage.onload = fallbackImage.onerror = null;
  alert('Failed to load tileset!');
};


var onFallbackSnowLoad = function() {
  fallbackImage.onload = fallbackImage.onerror = null;
  snowTileSet = new TileSet(fallbackImage, onAllTilesLoaded, onFallbackError);
};


var onFallbackTilesLoaded = function() {
  fallbackImage = new Image();
  fallbackImage.onload = onFallbackSnowLoad;
  fallbackImage.onerror = onFallbackError;
  fallbackImage.src = tileSetSnowURI/* TileSetSnowURI */.K;
};


var onFallbackLoad = function() {
  fallbackImage.onload = fallbackImage.onerror = null;
  tileSet = new TileSet(fallbackImage, onFallbackTilesLoaded, onFallbackError);
};


var tileSetError = function() {
  // We might be running locally in Chrome, which handles the security context of file URIs differently, which makes
  // things go awry when we try to create an image from a "tainted" canvas (one we've painted on). Let's try creating
  // the tileset by URI instead
  fallbackImage = new Image();
  fallbackImage.onload = onFallbackLoad;
  fallbackImage.onerror = onFallbackError;
  fallbackImage.src = tileSetURI/* TileSetURI */.J;
};


// Check for debug parameter in URL
Config.debug = window.location.search.slice(1).split('&').some(function(param) {
  return param.trim().toLowerCase() === 'debug=1';
});


var tiles = jquery('#tiles')[0];
tileSet = new TileSet(tiles, onTilesLoaded, tileSetError);
var snowtiles = jquery('#snowtiles')[1];

})();

/******/ })()
;