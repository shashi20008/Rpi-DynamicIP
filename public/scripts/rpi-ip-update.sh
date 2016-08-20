#!/bin/bash
USERNAME='INSERT_YOUR_EMAIL_HERE'
PASSWORD='INSERT_YOUR_PASSWORD_HERE'
HOST='martini-trackon.rhcloud.com/dyn-dns'

ping -c2 8.8.8.8 > /dev/null

if [ $? != 0 ]
then
        echo 'We are disconnected'
        touch /tmp/disconnected.lock
else
        if [ -f /tmp/disconnected.lock ]
        then
                echo 'Connection re-established'
                rm -rf /tmp/disconnected.lock
                myIP=`curl 'https://api.ipify.org'`
                oldIP=`cat /tmp/public.ip.old`

                if [ "$myIP" != "$oldIP" ]
                then
                        echo myIP > /tmp/public.ip.old

                        echo "my ip is $myIP"
                        # curl the ip to server
                        curl --data "username=$USERNAME&password=$PASSWORD&ip=$myIP" "$HOST"
                fi
        fi
fi