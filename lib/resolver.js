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
var fileResolver = require('file-resolver');
var path = require('path');
var VError = require('verror');

function Resolver(config) {
    this.contentPath = path.normalize(config.contentPath);
    this.fallback = config.fallback && path.normalize(config.fallback);
}

Resolver.prototype.resolve = function (config, cb) {
	var resolver = fileResolver.create({ root: this.contentPath, fallback: this.fallback, formatPath: config.formatPath });
    console.warn(config.bundle, config.locale);

    var contentPath = this.contentPath;
	resolver.resolve(config.bundle, config.locale || config.locality, function (err, info) {
        if (err) {
            return cb(err);
        } else if (!info.file) {
            return cb(new VError("%j not found", config.bundle));
        } else {
            cb(null, {
                "bundleFile": info.file || contentPath,
                "cacheKey": path.relative(contentPath, info.file)
            });
        }
    });

};

module.exports = Resolver;
