package com.asdt.supporthub;

import com.asdt.supporthub.auth.UserRepository;
import com.asdt.supporthub.ticket.repository.TicketRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest(properties = {
		"spring.autoconfigure.exclude=" +
				"org.springframework.boot.autoconfigure.neo4j.Neo4jAutoConfiguration," +
				"org.springframework.boot.autoconfigure.data.neo4j.Neo4jDataAutoConfiguration," +
				"org.springframework.boot.autoconfigure.data.neo4j.Neo4jRepositoriesAutoConfiguration"
})
class SupporthubApiApplicationTests {

	@MockitoBean
	UserRepository userRepository;

	@MockitoBean
	TicketRepository ticketRepository;

	@Test
	void contextLoads() {}
}
