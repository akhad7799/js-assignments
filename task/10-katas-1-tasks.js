'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
	let sides = ['N','E','S','W'];  // use array of cardinal directions only!

	let result = new Array();
	let curSide, nextSide, midSide, abbreviation;
	for (let side = 0; side < sides.length; side++) {
		curSide = sides[side];
		nextSide = sides[(side + 1) % sides.length];
		midSide = (side % 2 == 0) ? curSide + nextSide : nextSide + curSide;
		for (let compassPoint = 0; compassPoint < 8; compassPoint++) {
			switch (compassPoint) {
				case 0:
					abbreviation = curSide;
					break;
				case 1:
					abbreviation = curSide + 'b' + nextSide;
					break;
				case 2:
					abbreviation = curSide + midSide;
					break;
				case 3:
					abbreviation = midSide + 'b' + curSide;
					break;
				case 4:
					abbreviation = midSide;
					break;
				case 5:
					abbreviation = midSide + 'b' + nextSide;
					break;
				case 6:
					abbreviation = nextSide + midSide;
					break;
				case 7:
					abbreviation = nextSide + 'b' + curSide;
					break;
				default:
					break;
			}
			result.push({abbreviation: abbreviation, azimuth: (side * 8 + compassPoint) * 11.25});
		}
	}
	return result;
}

/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
const closingBracketIndex = (str, start) => {
    let count = 1, end = start + 1;
    for(; count != 0; end++) {
        if (str[end] === '}') count--;
        if (str[end] === '{') count++;
    }
    return end - 1;
}

const process = str => {
    let start = str.indexOf('{'), arr = [str.substr(0, start)];
    while (start != -1) {
        let end = closingBracketIndex(str, start), dummy = [];
        arr.forEach(a => {
            process(str.substr(start + 1, end - start - 1))
            .map(a => a.split(',')).reduce((a, b) => a.concat(b), [])
            .forEach(b => {
                dummy.push(a + b);
            });
        });
        arr = dummy;
        
        str = str.substr(end + 1);
        start = str.indexOf('{');
        arr = arr.map(a => a + str.substr(0, start));
    }
    return arr.map(a => a + str).filter((a, b, arr) => arr.indexOf(a) == b);
}
function* expandBraces(str) {
    yield* process(str);
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */

let max = (a, b) => a > b ? a : b;
let min = (a, b) => a < b ? a : b;

function getZigZagMatrix(n) {

    let arr = new Array(n).fill(0).map(a => new Array(n).fill(0));    
    let i = 0, j = 0, count = 0, counter = 1;
    while (count < n * n)  {
        while (i >= 0 && i < n && j >= 0 && j < n) {
            arr[i][j] = count++;
            i -= counter;
            j += counter;
        }
        let values = ((i, j) => {
            if (i == n) {
                return [i - 1, j + 2];
            } else if (j == n) {
                return [i + 2, j - 1];
            } else {
                return [min(max(0, i), n - 1), min(max(0, j), n - 1)];
            }
        })(i, j);
        i = values[0];
        j = values[1];
        counter = -counter;
    }
    return arr;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */

let next = (list, n) => {
    return list.map((a, b) => ({ i: b, v: a })).filter(a => a.v[0] === n || a.v[1] === n)
};
let test = (list, n) => {
    return next(list, n).some(a => {
        let clone = list.map(a => a);
        clone.splice(a.i, 1);
        return clone.length == 0 || test(clone, a.v[0] == n ? a.v[1] : a.v[0])
    });
};
function canDominoesMakeRow(dominoes) {
    return dominoes.some((a, b) => {
        let clone = dominoes.map(a => a);
        clone.splice(b, 1);
        return test(clone, a[0]) || test(clone, a[1]);
    });
}

/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    let result = "";
    let buf = [nums[0]];
    for(let i = 1 ; i < nums.length; i++)
    {
        if (nums[i] == (nums[ i - 1 ] + 1) )
        {
            buf.push(nums[i]);
            console.log(buf);
        }
        if((nums[i] !== (nums[ i - 1 ] + 1))|| (i == nums.length-1) )
        {   
            let res = (result.length > 0) ? "," : "";
            if (buf.length == 1)
            {
                result += res + String(buf[0]);
            }
            else if(buf.length == 2)
            {
                result += res + String(buf[0]) + "," + String(buf[1]);
            }
            else
            {
                result += res + String(buf[0]) + "-" + String(buf[buf.length - 1]);
            }
            buf = [nums[i]];
        }
        
    }
    return result;
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
