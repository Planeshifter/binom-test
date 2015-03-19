/**
*
*	COMPUTE: binom-test
*
*
*	DESCRIPTION:
*		- Binomial testing
*
*
*	NOTES:
*		[1]
*
*
*	TODO:
*		[1]
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2015. Philipp Burckhardt.
*
*
*	AUTHOR:
*		Philipp Burckhardt. pburckhardt@outlook.com. 2015.
*
*/

'use strict';

// MODULES //

var isNumber = require( 'validate.io-number-primitive' ),
	isString = require( 'validate.io-string-primitive' ),
	isNonNegativeInteger = require( 'validate.io-nonnegative-integer' );

var binomialCDF = require( 'jStat' ).jStat.binomial.cdf,
	binomialPDF = require( 'jStat' ).jStat.binomial.pdf;


// FUNCTIONS //

/**
* FUNCTION: binomTest()
* @param {Number} x - number of successes
* @param {Number} n - total number of observations
* @param {Number} p - null value for probability of success, number between 0 and 1
* @param {String} type - specifies the alternative hypothesis, either "two-sided", "less" or "greater"
* @returns {Number} pvalue - the p-value of the test
*/
function binomTest(x, n, p, type) {

	var sided, pvalue, relErr = 1+1e-07, d, m, y, i;

	if( !isNonNegativeInteger(x) ) {
		throw new TypeError( 'binomTest()::invalid input argument. Must provide a non-negative integer. Value: `' + x + '`.' );
	}
	if( !isNonNegativeInteger(n) ) {
		throw new TypeError( 'binomTest()::invalid input argument. Must provide a non-negative integer. Value: `' + n + '`.' );
	}

	if( x > n ) {
		throw new TypeError( 'binomTest()::invalid input arguments. x cannot be larger than n. Value: `x:' + x + ',' + 'n:' + n + '`.' );
	}

	if( !isNumber(p) ) {
		throw new TypeError( 'binomTest()::invalid input argument. Must provide a number. Value: `' + p + '`.' );
	} else {
		if( !(0 <= p && p <= 1) ) {
			throw new RangeError( 'binomTest()::invalid input argument. Must provide a number between 0 and 1. Value: `' + p + '`.' );
		}
	}

	sided = 'two-sided';
	if ( arguments.length > 3 ) {
		if( !isString(type) ){
			throw new TypeError( 'binomTest()::invalid input argument. Must provide a string. Value: `' + type + '`.' );
		} else {
			if(type !== 'two-sided' && type !== 'less' && type !== 'greater' ) {
				throw new RangeError( 'binomTest()::invalid input argument. Must provide either "two-sided", "lower" or "greater". Value: `' + type + '`.' );
			} else {
				sided = type;
			}
		}
	}

	switch( sided ) {
		case 'less':
			pvalue = binomialCDF(x, n, p);
		break;
		case 'greater':
			pvalue = 1 - binomialCDF(x - 1, n, p);
		break;
		case 'two-sided':
			d = binomialPDF(x, n, p);
			m = n * p;
			if( x === m ){
				pvalue = 1;
			} else if( x < m ) {
				y = 0;
				for(i = Math.ceil(m); i <= n; i++) {
					if( binomialPDF(i, n, p) <= d * relErr ) {
						y += 1;
					}
				}
				pvalue = binomialCDF(x, n, p) + ( 1 - binomialCDF(n - y, n, p ) );
		} else {
				y = 0;
				for(i = 0; i <= Math.floor(m); i++) {
					if( binomialPDF(i, n, p) <= d * relErr ) {
						y += 1;
					}
				}
				pvalue = binomialCDF(y - 1, n, p) + ( 1 - binomialCDF(x - 1, n, p) );
			}
		break;
	}

	return pvalue;

} // end FUNCTION binomTest()


// EXPORTS //

module.exports = binomTest;
