'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {

    puzzle = puzzle.map(a => a.split(''));
    let neighbours = (x, y, stack) => {
        return [[y + 1, x], [y, x + 1], [y - 1, x], [y, x - 1]].filter(a => {
            return a[0] >= 0 && a[0] < puzzle.length && a[1] >= 0 && a[1] < puzzle[0].length
                && !stack.some(b => a[0] == b[0] && a[1] == b[1]);
        }).map(a => ({ v: puzzle[a[0]][a[1]], x: a[1], y: a[0] }));
    };
    let next = (n, stack) => {
        return neighbours(n.x, n.y, stack).filter(a => a.v === searchStr[stack.length + 1]);
    };
    return searchStr.length === 0 || (function test(positions, stack) {
        return stack.map(a => 
                puzzle[a[0]][a[1]]).join('') === searchStr || 
                positions.some(a => {
            return test(next(a, stack), stack.concat([[a.y, a.x]]));
        });
    })(puzzle.map((a, b) =>
            a.map((c, d) => ({ v: c, x: d, y: b })))
            .reduce((a, b) =>
            a.concat(b), [])
            .filter(a => a.v === searchStr[0]), []);
}

/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 * 
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {

	function *HeapsAlgorithm(n, A) {
		if (n == 1) {
			yield A.join('');
		} else {
			let temp;
			for (let i = 0; i < n; i++) {
				yield *HeapsAlgorithm(n - 1, A);
				if (n % 2 == 0) {
					temp = A[i];
					A[i] = A[n - 1];
					A[n - 1] = temp;
				} else {
					temp = A[0];
					A[0] = A[n - 1];
					A[n - 1] = temp;
				}
			}
		}
	}
	
	yield *HeapsAlgorithm(chars.length, chars.split(''));
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing. 
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 * 
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {

    let profit = 0, count = quotes.length;

    while(--count > 0) {
        while(count >= 0 && quotes[count] < quotes[count - 1]) {
            count--;
        }
        let end = count--;
        while(count >= 0 && quotes[count] < quotes[end]) {
            count--;
        }
        count++;
        if (count >= 0) {
            profit += quotes[end] * (end - count) - quotes.slice(count, end).reduce((a, b) => a + b, 0);
        }
    }

    return profit;
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 * 
 * @class
 *
 * @example
 *    
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */

let store = new Map(), id = 0, generator = url => {
    store.set(++id, url);
    return id;
};

function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
                           "abcdefghijklmnopqrstuvwxyz"+
                           "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {

    encode: function(url) {
        let str = '', num = generator(url);
        while (num > 0) {
            str = this.urlAllowedChars.charAt(num % this.urlAllowedChars.length) + str;
            num = Math.floor(num / this.urlAllowedChars.length);
        }
        return 'https://test.go/' + str;
    },
    
    decode: function(code) {
        code = code.split('https://test.go/')[1];
        let num = 0;
        for (var i = 0; i < code.length; i++) {
            num = num * this.urlAllowedChars.length + this.urlAllowedChars.indexOf(code.charAt(i));
        }
        return store.get(num);
    },
    
    constructor: UrlShortener
}


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
