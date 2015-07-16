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

var VError = require('verror');

var bundlers = {
	dust: require('./bundler/dust'),
	none: require('./bundler/none')
};

function bundalo(config) {
	var Bundler;
	var engine = config.engine || 'none';
	if (!config.contentPath) {
		throw new TypeError("Please provide a contentPath");
	}

	Bundler = bundlers[engine];
	if (Bundler) {
		return new Bundler({
            bundle: config.bundle,
            locale: config.locale || config.locality,
            cache: config.cache,
            model: config.model,
            contentPath: config.contentPath,
            formatPath: config.formatPath,
            fallback: config.fallback
        });
	} else {
		throw new VError("engine must be one of %j", bundlers);
	}
}
module.exports = bundalo;

