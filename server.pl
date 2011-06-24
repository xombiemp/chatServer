#!/usr/bin/perl -w
use IO::Socket;
use Net::hostent;              # for OO version of gethostbyaddr
use URI::Escape;
use Text::Emoticon::Yahoo;

$PORT = 9020;                  # port that is open

$server = IO::Socket::INET->new( Proto     => 'tcp',	#tcp connection
                                 LocalPort => $PORT,
                                 Listen    => 20,	#number of connections
                                 Reuse     => 1);
								  
die "can't setup server" unless $server;
print "[Server $0 accepting clients at http://localhost:$PORT/]\n";

$emoticon = Text::Emoticon::Yahoo->new( #imgbase => "http://yourhost.example.com/images/emoticons",
      									xhtml   => 1,
      									class   => "emoticon");	#set up emoticon module

while ($client = $server->accept()) {
	# my $pid = fork();
	# die "Cannot fork" unless defined $pid;
	# do { close $client; next; } if $pid; # parent
	# fall through in child
	$client->autoflush(1);
	
	my $request = <$client>;
	if ($request =~ m|^GET /([^?]*)(?:\?(.*))? HTTP/1.[01]|) {	#request is a file with or without a querystring
		my $page = uri_unescape($1);	#the requested resource, unescaped
		my $querystring = uri_unescape($2);	#the querystring, unescaped
		
		if (!$page) {
			$page = "index.html";	#if there is no request file, default to index.html
		}
		
		if ($querystring) {
			$querystring =~ /name=(.*)&send=(.*)/;	#parse out the name and message sent
			my $name = $1;
			my $sent = $2;
			$name =~ s/\+/ /g;	#replace + symboles with spaces
			$sent =~ s/\+/ /g;
			
			$sent = $emoticon->filter($sent);	#replace emoticons with image tags
			
			open (CHAT, "+>>chatHistory.txt") or die "Can't create new.txt: $!";	#open chatHistory.txt and write the name and message to it
			print(CHAT "$name\: $sent <br>\n");
			close(CHAT);
		}
		
		if ($page =~ /clearHistory/) {
			open (CHAT, ">chatHistory.txt") or die "Can't create new.txt: $!";	#open chatHistory.txt an clear everything inside
			print(CHAT "");
			close(CHAT);
		}
		
		if (-e $page) {  #if the requested resource exists
		
			###Check the extention of the requested resource to print the appropriate Content-Type###
			if ($page =~ /\.txt$/) {
		    	print $client "HTTP/1.0 200 OK\nContent-Type: text/plain\n\n";
			}
			elsif ($page =~ /\.js$/) {
		    	print $client "HTTP/1.0 200 OK\nContent-Type: application/javascript\n\n";
			}
			elsif ($page =~ /\.html$/) {
				print $client "HTTP/1.0 200 OK\nContent-Type: text/html\n\n";
			}
			elsif ($page =~ /\.css$/) {
		    	print $client "HTTP/1.0 200 OK\nContent-Type: text/css\n\n";
			}
			elsif ($page =~ /\.htm$/) {
		      print $client "HTTP/1.0 200 OK\nContent-Type: text/html\n\n";
			}
			elsif ($page =~ /\.pl$/) {
		      print $client "HTTP/1.0 200 OK\nContent-Type: text/plain\n\n";
			}
			elsif ($page =~ /\.jpg$/) {
		      print $client "HTTP/1.0 200 OK\nContent-Type: image/jpeg\n\n";
			}
			elsif ($page =~ /\.jpeg$/) {
		      print $client "HTTP/1.0 200 OK\nContent-Type: image/jpeg\n\n";
			}
			elsif ($page =~ /\.gif$/) {
		      print $client "HTTP/1.0 200 OK\nContent-Type: image/gif\n\n";
			}
			elsif ($page =~ /\.png$/) {
		      print $client "HTTP/1.0 200 OK\nContent-Type: image/png\n\n";
			}
			
			open(my $f,"<$page");	#open the requested resource and print each line to the browser
			while(<$f>) { print $client $_ }; 
		} 
		else {	#the file doesn't exist
			print $client "HTTP/1.0 404 FILE NOT FOUND\n";
			print $client "Content-Type: text/plain\n\n";
			print $client "file $page not found\n";
		}      
	} 
	else {	#the request is not a GET
		print $client "HTTP/1.0 400 BAD REQUEST\n";
		print $client "Content-Type: text/plain\n\n";
		print $client "BAD REQUEST\n";
	}
	
	close $client;
}