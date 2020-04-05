const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => {
    let mode = env.mode;
    return {
        entry: './src/js/index.js',
        output: {
            path: path.resolve(__dirname, 'docs')
        },
        devServer: {
            contentBase: path.resolve(__dirname, 'src'),
        },
        devtool: mode === 'dev' ? 'cheap-source-map' : 'none',
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        'file-loader'
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html'
            })
        ]
    }
}