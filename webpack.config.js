const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        admin: './src/admin.jsx',
        chatbox: './src/chatbox.jsx',
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],
};
