package com.asdt.supporthub.ticket.repository;

import com.asdt.supporthub.ticket.domain.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

import java.util.UUID;


public interface TicketRepository extends Neo4jRepository<Ticket, UUID> {

    @Query(
            value = """
            MATCH (t:Ticket)
            WHERE ($status IS NULL OR t.status = $status)
              AND ($q IS NULL OR toLower(t.title) CONTAINS toLower($q))
            RETURN t
            """,
            countQuery = """
            MATCH (t:Ticket)
            WHERE ($status IS NULL OR t.status = $status)
              AND ($q IS NULL OR toLower(t.title) CONTAINS toLower($q))
            RETURN count(t)
            """
    )
    Page<Ticket> search(String status, String q, Pageable pageable);
}