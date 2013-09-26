({
    appDir: '../',
    baseUrl: 'js',
    dir: '/tmp/temp-appname-min',
    mainConfigFile: 'app.js',
    modules: [
        {name: 'app'}
    ],
    optimize: 'uglify',
    paths: {
        // These are referred to by handlebars but not used so they're stubbed
        'fs' : 'stub/fs',
        'path' : 'stub/path',
        'file' : 'stub/file',
        'system' :'stub/system',
    }
})
