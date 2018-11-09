import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AlertController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  unpairedDevices: any;
  pairedDevices: any;
  gettingDevices: Boolean;
  
  constructor
  (
    private bluetoothSerial: BluetoothSerial, 
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    private screenOrientation: ScreenOrientation,
  ) 
  {
    this.screenOrientation.unlock();
    bluetoothSerial.enable();
  }

  ionViewWillEnter(){
    this.listPairedDevices();
  }

  startScanning(){
    //this.pairedDevices = null;
    this.unpairedDevices = null;
    this.gettingDevices = true;
    this.bluetoothSerial.discoverUnpaired()
    .then(
      (success) => 
      {
        this.unpairedDevices = success;
        this.gettingDevices = false;
        success.forEach(
          element => 
          {
            console.log("Discover Unpaired Succes: ", element);
          }
        );
      },
      (err) => {
        console.log("Discover Unpaired Error: ", err);
      }
    )
  }
  
  listPairedDevices(){
    this.bluetoothSerial.list()
    .then(
      (success) => {
        console.log("List Unpaired Succes: ", success);
        this.pairedDevices = success;
      },
      (err) => {
        console.log("List Unpaired Error: ", err);
      }
    )
  }

  success = (data) => alert(data);
  fail = (error) => alert(error);

  selectDevice(address: any){

    let alert = this.alertCtrl.create({
      title: 'Connect',
      message: 'Do you want to connect with ' + address + '?',
      cssClass: 'colorLight',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Connect',
          handler: () => {
            this.bluetoothSerial.connect(address).subscribe(this.success, this.fail);
          }
        }
      ]
    });
    alert.present();

  }

  disconnect() {
    let alert = this.alertCtrl.create({
      title: 'Disconnect?',
      message: 'Do you want to Disconnect?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Disconnect',
          handler: () => {
            this.bluetoothSerial.disconnect();
          }
        }
      ]
    });
    alert.present();
  }

}
