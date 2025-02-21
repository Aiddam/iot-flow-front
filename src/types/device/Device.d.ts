export interface Device {
  deviceGuid: string;
  name: string;
  lastSeen?: Date;
  isAlive?: boolean;
  methods: Method[];
}
