import { Shippo, Parcels, Shipment, Rate, Transaction, DistanceUnitEnum, WeightUnitEnum, AddressCreateRequest } from 'shippo';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

async function main(): Promise<void> {
  // Initialize the Shippo client
  const sdk: Shippo = new Shippo({ apiKeyHeader:"<YOUR API TOKEN>" });

  // Create a shipment
  const shipment: Shipment = await sdk.shipments.create({
    addressFrom: {
      name: "Shawn Ippotle",
      street1: "215 Clayton St.",
      city: "San Francisco",
      state: "CA",
      zip: "94117",
      country: "US",
      phone: "+1 555 341 9393",
      email: "test@gmail.com"
    } as AddressCreateRequest,
    addressTo: {
      name: "Mr. Hippo",
      street1: "1092 Indian Summer Ct",
      city: "San Jose",
      state: "CA",
      zip: "95122",
      country: "US",
      phone: "+1 555 341 9393",
      email: "test@gmail.com"
    } as AddressCreateRequest,
    parcels: [{
      length: "15",
      width: "15",
      height: "15",
      distanceUnit: DistanceUnitEnum.Cm,
      weight: ".2",
      massUnit: WeightUnitEnum.Kg,
    }] as Parcels[],
  });

  console.log(`Shipment ID ${shipment.objectId}`);

  // We didn't specify 'async' above, so rates will be returned in the response
  shipment.rates.forEach((rate: Rate) => {
    console.log(`${rate.objectId} ${rate.provider} ${rate.servicelevel.name}, Arrives in ${rate.estimatedDays} days: ${rate.amountLocal}${rate.currencyLocal}`);
  });

  // Get the lowest rate
  const lowestRate: Rate = shipment.rates.sort((a: Rate, b: Rate) => 
    parseFloat(a.amountLocal) - parseFloat(b.amountLocal))[0];

  let transaction: Transaction = await sdk.transactions.create({
    labelFileType: "PDF_4x6",
    metadata: "Order ID #12345",
    rate: lowestRate.objectId
  });

  console.log(`Transaction ID ${transaction.objectId}`);

  while (transaction.status === "QUEUED") {
    await new Promise(resolve => setTimeout(resolve, 1000));
    transaction = await sdk.transactions.get(<string>transaction.objectId);
  }

  if (transaction.status === "SUCCESS") {
    console.log(`Label URL: ${transaction.labelUrl}`);
    console.log(`Tracking URL: ${transaction.trackingUrlProvider}`);
    const downloadsFolder = path.join(os.homedir(), 'Downloads');
    const filePath = path.join(downloadsFolder, `${transaction.objectId}.pdf`);

    const file = fs.createWriteStream(filePath);
    
    await new Promise<void>((resolve, reject) => {
      https.get(<string>transaction.labelUrl, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Label downloaded to ${filePath}`);
          resolve();
        });
        file.on('error', (err) => {
          fs.unlink(filePath, () => {});
          reject(err);
        });
      }).on('error', (err) => {
        fs.unlink(filePath, () => {});
        console.error(`Error downloading label: ${err.message}`);
        reject(err);
      });
    });
  }
}

// Execute the main function
main().catch(error => {
  console.error('Error occurred:', error);
});