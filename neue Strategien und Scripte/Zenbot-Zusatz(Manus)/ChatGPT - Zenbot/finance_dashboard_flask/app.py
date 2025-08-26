
from flask import Flask, render_template, send_from_directory

app = Flask(__name__)

@app.route('/')
def index():
    charts = [
        '1_line_chart.html', '2_bar_chart.html', '3_candlestick_chart.html',
        '4_area_chart.html', '5_pie_chart.html', '6_ohlc_chart.html',
        '7_scatter_plot.html', '8_heatmap.html', '9_waterfall_chart.html',
        '10_treemap.html'
    ]
    return render_template('index.html', charts=charts)

@app.route('/charts/<name>')
def chart(name):
    return send_from_directory('charts', name)

if __name__ == '__main__':
    app.run(debug=True)
