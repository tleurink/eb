import { Component, NgZone  } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

//Pages
import { SettingsPage } from '../settings/settings';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  range: number = 0;
  velocity: number = 0;
  charge: number = 0;
  distance: number = 0;
  innerStyle: any;
  lowBeam: boolean = false;
  lowBeamRes: string = "X0";
  highBeam: boolean = false;
  highBeamRes: string = "Y0";
  beamResponse: string;

  constructor
  (
    private bluetoothSerial: BluetoothSerial, 
    public navCtrl: NavController,
    private screenOrientation: ScreenOrientation,
    private zone: NgZone
  ) 
  {}

  ionViewWillEnter() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    this.readBluetooth();
  }

  readBluetooth(){
    this.bluetoothSerial.subscribe("G")
    .subscribe(
      (res: any) => 
      { 

        this.zone.run(() => {
          this.velocity = res.substring(
            res.lastIndexOf("A") + 1,
            res.lastIndexOf("B")
          );
  
          this.charge = res.substring(
            res.lastIndexOf("B") + 1,
            res.lastIndexOf("C")
          );
  
          this.range = res.substring(
            res.lastIndexOf("C") + 1,
            res.lastIndexOf("D")
          );

          this.distance = res.substring(
            res.lastIndexOf("D") + 1,
            res.lastIndexOf("E")
          );

          this.innerStyle = { 
            "height" : this.charge + "%",
            "top" : 100 - this.charge + "%"
          }
        });

      },
      (err: any) => { console.log("Err: ", err) }
    );
  }

  toggleLowbeam(){
    if( this.lowBeam ){
      this.lowBeamRes = "X1";
    }
    else{
      this.lowBeamRes = "X0";      
    }
    this.generateResponse();
    this.bluetoothSerial.write(this.beamResponse).then(
      (res: any) => { console.log("Beamrespons: ", this.beamResponse, "Succes message: ", res) },
      (err: any) => { console.log("Beamrespons: ", this.beamResponse, "Error message: ", err) },
    );
  }

  toggleHighbeam(){
    if( this.highBeam ){
      this.highBeamRes = "Y1";
    }
    else{
      this.highBeamRes = "Y0";
    }
    this.generateResponse();
    this.bluetoothSerial.write(this.beamResponse).then(
      (res: any) => { console.log("Beamrespons: ", this.beamResponse, "Succes message: ", res) },
      (err: any) => { console.log("Beamrespons: ", this.beamResponse, "Error message: ", err) },
    );
  }

  generateResponse(){
    this.beamResponse = this.lowBeamRes + this.highBeamRes + 'Z';
  }

  goToSettings(){
    this.navCtrl.push(SettingsPage);
  }

}
