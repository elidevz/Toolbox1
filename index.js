const { Webhook, MessageBuilder } = require('discord-webhook-node');
const readlineSync = require('readline-sync');
const { Server, got } = require('got-tls')
var XMLHttpRequest = require('xhr2');
const config = require('./config.json');
hook = new Webhook(config.webhook);


Server.connect();



const toolboxver = 1;


function onStartup() {
    process.stdout.write('\x1Bc');
    console.log()
    console.log()

    
    
    console.log('\x1b[33m%s\x1b[0m', 'Starting toolbox...');
    const http = new XMLHttpRequest();
    http.open('GET', 'https://google.com/', true);
    http.send();
    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            var latestver = 1;
            // if it is not equal
            
            if (toolboxver != latestver) {
                console.log()
                console.log('\x1b[32m%s\x1b[0m', 'New version available!')
                console.log('Current version: ' + toolboxver)
                console.log('Latest version: ' + latestver)
                console.log()
                readlineSync.question('Press enter to exit...');
                process.exit(1);
            } else {
                console.log()
                console.log('\x1b[32m%s\x1b[0m', 'Toolbox is up to date.')
                console.log('\x1b[32m%s\x1b[0m', 'Current version: ' + toolboxver)
                console.log('\x1b[32m%s\x1b[0m', 'Latest version: ' + latestver)
                //
                console.log()
                main();

            }
        }
    }
}


function main() {
    console.log('\x1b[32m%s\x1b[0m', 'Welcome to the toolbox!')
    console.log()
    console.log('\x1b[33m%s\x1b[0m', 'What would you like to do?')
    console.log('1. BestBuy SKU Checker')
    console.log('2. YeezySupply Toolbox')
    console.log('3. Exit')
    console.log()
    var choice = readlineSync.question('Enter your choice: ');
    if (choice == 1) {
        console.log()
        console.log('\x1b[33m%s\x1b[0m', 'Starting BestBuy SKU Checker...')
        console.log()
        bbSkuChecker();
    } else if (choice == 2) {
        console.log()
        console.log('\x1b[33m%s\x1b[0m', 'Forwarding to YeezySupply Toolbox...')
        console.log()
        ysToolbox();
    } else if (choice == 3) {
        console.log()
        console.log('\x1b[33m%s\x1b[0m', 'Exiting...')
        console.log()
        process.exit(1);
    }
}


function bbSkuChecker() {
    process.stdout.write('\x1Bc');
    console.log()
    var sku = readlineSync.question('Enter the SKU: ');
    var url = 'https://www.bestbuy.com/api/3.0/priceBlocks?skus=' + sku;

    (async () => {
        let response = await got.get(url, {
            headers: {
                'accept': '*/*',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
        }
    })

    const bestbuy = await JSON.parse(response.body);
    console.log();
    const purcstatus = bestbuy[0].sku.buttonState.displayText;


    console.log('Product Name: ' + bestbuy[0].sku.names.short);
    console.log('Brand: ' + bestbuy[0].sku.brand.brand);
    console.log('Product Class: ' + bestbuy[0].sku.subclass.displayName);
    console.log()
    console.log('Price: ' + bestbuy[0].sku.price.currentPrice);
    console.log('Purchase Status:' + purcstatus);

    console.log()
    console.log('\x1b[33m%s\x1b[0m', 'Would you like to check another SKU?')
    console.log('\x1b[33m%s\x1b[0m', '1. Yes')
    console.log('\x1b[33m%s\x1b[0m', '2. No')
    console.log()
    var choice = readlineSync.question('Enter your choice: ');
    if (choice == 1) {
        console.log()
        console.log('\x1b[33m%s\x1b[0m', 'Starting BestBuy SKU Checker...')
        console.log()

        bbSkuChecker();
    } else if (choice == 2) {
        console.log()
        console.log('\x1b[33m%s\x1b[0m', 'Returning to main...')
        console.log()
        process.stdout.write('\x1Bc');

        main();
    }
})();
}


function ysProductChecker() {
    process.stdout.write('\x1Bc');
    var sku = readlineSync.question('Enter the SKU: ');
            var ysurl = 'https://www.yeezysupply.com/api/products/' + sku;
            (async () => {
                let response = await got.get(ysurl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
                }
            })
                
                const ys = await JSON.parse(response.body);
                console.log();
                

                const name = ys.name;
                const price = ys.pricing_information.currentPrice.toString();
                const sizeinfo = ys.yeezyPDPCallout[0];
                const colorinfo = ys.attribute_list.color;


                console.log('Product Name: ' + ys.name);
                console.log('Price: ' + ys.pricing_information.currentPrice);
                console.log('Size info: ' + ys.yeezyPDPCallout[0]);
                console.log('Color info: ' + ys.attribute_list.color);

                const imageurl = ys.view_list[0].image_url
                const embed = new MessageBuilder()
                    .setTitle(name)
                    .setURL('https://www.yeezysupply.com/product/' + sku)
                    .addField('SKU', sku, true)
                    .addField('Price', '$' + price, true)
                    .addField('Size Note', sizeinfo, false)
                    .addField('Color', colorinfo, false)
                    .setThumbnail(imageurl)
                    .setColor(0x00ff00)
                    .setFooter('Yeezy Supply')
                    .setTimestamp()

                hook.send(embed);
                await new Promise(resolve => setTimeout(resolve, 2000));
                console.log()
                console.log('\x1b[33m%s\x1b[0m', 'Would you like to check another SKU?')
                console.log('\x1b[33m%s\x1b[0m', '1. Yes')
                console.log('\x1b[33m%s\x1b[0m', '2. No')
                console.log()
                var choice = readlineSync.question('Enter your choice: ');
                if (choice == 1) {
                    console.log()
                    console.log('\x1b[33m%s\x1b[0m', 'Starting Yeezy Supply SKU Checker...')
                    console.log()
                    ysProductChecker();
                } else if (choice == 2) {
                    console.log()
                    console.log('\x1b[33m%s\x1b[0m', 'Returning to main...')
                    console.log()
                    process.stdout.write('\x1Bc');
                    ysToolbox();
                }
            })();
        }


function ysWaitingRoom() {

    

    require('log-timestamp');
    const url = 'https://www.yeezysupply.com/hpl/content/yeezy-supply/config/US/waitingRoomConfig.json';
    (async () => {
        let response = await got.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
        }
    })
        const waitingroom = await JSON.parse(response.body);
        console.log();
        const wrstatus = waitingroom.ysStatusMessageKey;
        if (wrstatus == 'welcome') {
            console.log('\x1b[33m%s\x1b[0m', 'Waiting Room is live!');
            console.log()
        } else if (wrstatus == 'sale_started') {
            console.log('\x1b[32m%s\x1b[0m', 'Sale has started!');
            console.log()
        } else if (wrstatus == 'sold_out') {
            console.log('\x1b[31m%s\x1b[0m', 'Sold Out!');
            console.log()
        } else { 
            console.log('\x1b[31m%s\x1b[0m', 'Unknown Status');
            console.log()
        }
        await new Promise(resolve => setTimeout(resolve, 20000));
        ysWaitingRoom();
    })();
}


function ysBloom() {
    const bloomurl = 'https://www.yeezysupply.com/api/yeezysupply/products/bloom';
    (async () => {
        let response = await got.get(bloomurl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
        }
    })
        const bloom = await JSON.parse(response.body);
        console.log();
    

    for (i in bloom) {
        const embed = new MessageBuilder()
            .setTitle(bloom[i].product_name)
            .setURL('https://www.yeezysupply.com/product/' + bloom[i].product_id)
            .addField('SKU', bloom[i].product_id, true)
            .addField('Price', '$' + bloom[i].price.toString(), true)
            .addField('Size Note', bloom[i].calloutMessages[0], false)
            .addField('Color', bloom[i].color, false)
            .setThumbnail(bloom[i].image.link)
            .setColor(0x00ff00)
            .setFooter('Yeezy Supply')
            .setTimestamp()

        hook.send(embed);
        console.log('\x1b[32m%s\x1b[0m', 'Sent information for: ' + bloom[i].product_name);
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    console.log()
    readlineSync.question('Press enter to return to main...');
    console.log()
    process.stdout.write('\x1Bc');
    ysToolbox();
    })();
}


function ysToolbox() {
    process.stdout.write('\x1Bc');
    console.log()
    console.log()
    console.log('\x1b[33m%s\x1b[0m', 'Starting YeezySupply Toolbox...')
    console.log()
    console.log('\x1b[33m%s\x1b[0m', 'What would you like to do?')
    console.log('1. Check for a product')
    console.log('2. Monitor the Waiting Room')
    console.log('3. Webhook Bloom Products (ALL YS PRODUCTS ON SITE)')
    console.log('4. Return to Main')
    console.log()
    var choice = readlineSync.question('Enter your choice: ');
    if (choice == 1) {
        console.log()
        console.log('\x1b[33m%s\x1b[0m', 'Starting YeezySupply Product Checker...')
        console.log()
        ysProductChecker();
    } else if (choice == 2) {
        console.log()
        console.log('\x1b[33m%s\x1b[0m', 'Starting YeezySupply Waiting Room Monitor...')
        console.log()
        process.stdout.write('\x1Bc');
        ysWaitingRoom();
    } else if (choice == 3) {
        console.log()
        console.log('\x1b[33m%s\x1b[0m', 'Starting YeezySupply Bloom...')
        console.log()
        process.stdout.write('\x1Bc');
        ysBloom();
    } else if (choice == 4) {
        console.log()
        console.log('\x1b[33m%s\x1b[0m', 'Returning to main...')
        console.log()
        process.stdout.write('\x1Bc');
        main();
    }
}















onStartup();
