'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
let numbers = [' _ | ||_|','     |  |',' _  _||_ ',' _  _| _|',
    '   |_|  |',' _ |_  _|',' _ |_ |_|',' _   |  |', ' _ |_||_|',' _ |_| _|'];
function parseBankAccount(bankAccount) {
    bankAccount = bankAccount.split('\n').slice(0, 3);
    let arr = [];
    for (let i = 0; i < bankAccount[0].length; i+= 3) {
        arr.push(bankAccount.reduce((a, b) => a + b.substr(i, 3), ''));
    }
    return +arr.map(a => numbers.indexOf(a)).reduce((a, b) => a + b, '');
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    text = text.split(' ');
    let temp = '';
    for (let n of text) {
        if (temp.length + n.length > columns) {
            yield temp.substr(0, temp.length - 1);
            temp = '';
        }
        temp += n + ' ';
    }
    yield temp.substr(0, temp.length - 1);
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

let cardTypes = ['♥', '♠', '♣', '♦'];

function getPokerHandRank(hand) {

    let positions = new Array(14).fill(0);
    let cards = hand.map(a => a.substr(0, a.length - 1)).map(a => {
        return a == 'A' && 1 || a == 'J' && 11 || a == 'Q' && 12 || a == 'K' && 13 || +a;
    });
    let flush = cardTypes.map(a => a + a + a + a + a).indexOf(hand.map(a => a[a.length - 1]).join('')) >= 0;
    
    cards.forEach(a => {
        positions[a - 1] += 1;
        if (a === 1) positions[13] += 1;
    });
    let straight = positions.join('').indexOf('11111') != -1;
    
    if (flush && straight) return PokerRank.StraightFlush;
    if (positions.indexOf(4) >= 0) return PokerRank.FourOfKind;
    if (positions.indexOf(3) >= 0 && positions.indexOf(2) >= 0) return PokerRank.FullHouse;
    if (flush) return PokerRank.Flush;
    if (straight) return PokerRank.Straight;
    if (positions.indexOf(3) >= 0) return PokerRank.ThreeOfKind;
    if (positions.slice(0, positions.length - 1).join('').match(/22|2[01]+2/)) return PokerRank.TwoPairs;
    if (positions.indexOf(2) >= 0) return PokerRank.OnePair;


    return PokerRank.HighCard;
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */


function* getFigureRectangles(figure) {
    figure = figure.split('\n');
    figure = figure.slice(0, figure.length - 1).map(a => a.split(''));
    
    let shapes = [];
    for (let i = 0; i < figure.length - 1; i++) {
        for (let j = 0; j < figure[i].length - 1; j++) {
            if (figure[i][j] === '+' && figure[i][j + 1] && figure[i][j + 1] !== ' ' && figure[i + 1] && figure[i + 1][j] !== ' ') {
                let n = i, m = j;
                while (n < figure.length - 1 && (figure[++n][j] !== '+' || figure[n][j - 1] === ' ')) {}
                while (m < figure[i].length - 1 && (figure[i][++m] !== '+' || figure[i + 1][m] === ' ')) {}
                if (figure[n][m] == '+' && figure[n].slice(j + 1, m).join('').indexOf(' ') === -1 &&
				    figure.slice(i + 1, n).map(a => a[m]).join('').indexOf(' ') === -1) {
                    shapes.push([n - i + 1, m - j + 1]);
                }
            }
        }
    }
    yield* shapes.map(a => {
        let arr = [];
        for (let i = 0; i < a[0]; i++) {
            let temp = [];
            for (let j = 0; j < a[1]; j++) {
                let n = ' ';
                if ((i == 0 && j == 0) || (i == a[0] - 1 && j == a[1] - 1) || (i == a[0] - 1 && j == 0) || (i == 0 && j == a[1] - 1)) n = '+';
                else if (i == 0 || i == a[0] - 1) n = '-';
                else if (j == 0 || j == a[1] - 1) n = '|';
                temp.push(n);
            }
            arr.push(temp.join(''));
        }
        return arr.join('\n') + '\n';
    });
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
