/*───────────────────────────────────────────────────────────────────────────*\
 │  Copyright (C) 2014 eBay Software Foundation                                │
 │                                                                             │
 │hh ,'""`.                                                                    │
 │  / _  _ \  Licensed under the Apache License, Version 2.0 (the "License");  │
 │  |(@)(@)|  you may not use this file except in compliance with the License. │
 │  )  __  (  You may obtain a copy of the License at                          │
 │ /,'))((`.\                                                                  │
 │(( ((  )) ))    http://www.apache.org/licenses/LICENSE-2.0                   │
 │ `\ `)(' /'                                                                  │
 │                                                                             │
 │   Unless required by applicable law or agreed to in writing, software       │
 │   distributed under the License is distributed on an "AS IS" BASIS,         │
 │   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  │
 │   See the License for the specific language governing permissions and       │
 │   limitations under the License.                                            │
 \*───────────────────────────────────────────────────────────────────────────*/
'use strict';
var async = require('async');
var _ = require('lodash');
var path = require('path');
var iferr = require('iferr');

module.exports = function loopalo(config, resolver, handler, callback) {
	var bundleRenderer = {};
	var bundleKey = {};
	var bundleAs = Object;
	var configBundle = [];

	if (config.bundle.constructor === String) {
		//user wants one bundle (string)
		bundleKey[config.bundle] = config.bundle;
		configBundle = [config.bundle];
		bundleAs = String;
	} else if (config.bundle.constructor === Array) {
		//multiple bundles non-aliased (array)
		config.bundle.forEach(function (key) {
			bundleKey[key] = key;
		});
		configBundle = config.bundle;
		bundleAs = Array;
	} else {
		//multiple bundles aliased (object)
		Object.keys(config.bundle).forEach(function (bundle) {
			bundleKey[config.bundle[bundle]] = bundle;
			configBundle.push(config.bundle[bundle]);
		});
	}
	async.eachLimit(configBundle, 10, function processBundle(bundle, next) {
		var localConfig = _.clone(config);

        if (path.extname(bundle) !== '.properties') {
            bundle = bundle + '.properties';
        }

		localConfig.bundle = path.normalize(bundle);
		resolver.resolve(localConfig, function (err, resolved) {
            if (err) {
                return next(err);
            } else {
                bundleRenderer[bundleKey[bundle]] = function (cb) {
                    handler(resolved.bundleFile, resolved.cacheKey, cb);
                };
                next();
            }
        });
	}, iferr(callback, function () {
        async.parallel(bundleRenderer, iferr(callback, function (results) {
            var returnVal = results;
            //if only one bundle object, remove top level key
            if (bundleAs === String) {
                returnVal = results[Object.keys(results)[0]];
            }
            callback(null, returnVal);
        }));
    }));

};
